import warnings, tempfile, shutil
from pathlib import Path
import subprocess, sys

# ─── 필수 패키지 리스트 ───
required_packages = {
    "cv2": "opencv-python",
    "mediapipe": "mediapipe",
    "torch": "torch",
    "facenet_pytorch": "facenet-pytorch",
    "pandas": "pandas",
    "numpy": "numpy",
    "scipy": "scipy",
    "xgboost": "xgboost",
    "joblib": "joblib"
}

# ─── 설치 시도 ───
for module_name, pip_name in required_packages.items():
    try:
        __import__(module_name)
    except ImportError:
        try:
            print(f"[INFO] {module_name} 누락 → pip 설치 시도")
            subprocess.check_call([sys.executable, "-m", "pip", "install", pip_name])
        except subprocess.CalledProcessError:
            print(f"[경고] {module_name} 설치 실패 → 해당 기능 사용 불가할 수 있음")

# ─── 설치 후 import 재시도 ───
import cv2, numpy as np, pandas as pd
import torch
try:
    import mediapipe as mp
except ImportError:
    mp = None  # 나중에 사용할 때 None인지 체크 필요
from facenet_pytorch import MTCNN
from scipy.stats import skew, kurtosis
from scipy.signal import find_peaks

# ─────────────────────────────────────────────────────────────
def facial_palsy(video_path: str,
                 artefact_path: str = "xgb_stroke.pkl",
                 fps: int = 10) -> dict:          # ← plain dict for Py 3.9
    """
    One-liner use:
        facial_palsy("test.mp4")        # default artefact + 10 fps

    Flow
    ----
    ① extract tmp frames (@ `fps`)  
    ② MTCNN face-box  ➜  MediaPipe FaceMesh 468 pts  
    ③ compute 11 facial-asymmetry indices per frame  
    ④ aggregate to 168-D vector (15 stats × 11 + 3 correlations)  
    ⑤ predict with stored XGBoost & threshold in `artefact_path`  
    ⑥ delete tmp folder, print & return {'video', 'probability', 'label'}
    """
    warnings.filterwarnings("ignore")

    # ─── artefact (joblib ▸ pickle fallback) ───
    try:
        import joblib                           # noqa: F401
        artefact = joblib.load(artefact_path)
    except ModuleNotFoundError:                 # joblib absent
        import pickle
        print("[INFO] joblib 미설치 → pickle 로 artefact 로드")
        with open(artefact_path, "rb") as f:
            artefact = pickle.load(f)

    try:
        import xgboost                          # noqa: F401
    except ModuleNotFoundError:                 # xgboost absent
        raise ModuleNotFoundError(
            "xgboost 가 없습니다.  `pip install xgboost==1.7.6` 먼저 실행하세요."
        ) from None

    model, thr = artefact["model"], artefact["threshold"]

    # ─── util: video → tmp frame folder ───
    def _extract_frames(vp: str, target_fps: int):
        tmp_root = tempfile.mkdtemp()
        dst_dir  = Path(tmp_root, Path(vp).stem); dst_dir.mkdir()
        cap = cv2.VideoCapture(vp)
        if not cap.isOpened():
            raise RuntimeError(f"Cannot open {vp}")
        stride = max(int((cap.get(cv2.CAP_PROP_FPS) or 30) // target_fps), 1)
        idx = saved = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            if idx % stride == 0:
                cv2.imwrite(str(dst_dir / f"f_{saved:04d}.jpg"), frame)
                saved += 1
            idx += 1
        cap.release()
        return str(dst_dir), tmp_root

    frame_dir, tmp_root = _extract_frames(video_path, fps)

    # ─── 11 index helpers ───
    _ns  = lambda l,p: np.nan if p is None else abs(l[1][0]   - p[1][0])
    _ja  = lambda l,p: np.nan if p is None else abs(l[152][0] - p[152][0])
    _eci = lambda l,*_: (abs(l[159][1]-l[145][1])+abs(l[386][1]-l[374][1]))/2

    def _smm(l,p):
        if p is None: return np.nan
        dr=np.linalg.norm(l[61]-p[61]); dl=np.linalg.norm(l[291]-p[291])
        d=np.hypot(dr,dl); return (dr*dl)/d if d else np.nan

    def _dms(l,*_):
        idx=[61,146,91,181,84,17,314,405,321,375,291]; mid=(l[61][0]+l[291][0])/2
        L=[l[i][0] for i in idx if l[i][0]<mid]; R=[l[i][0] for i in idx if l[i][0]>=mid]
        sL,sR=sum(L),sum(R); return abs(sL-sR)/(sL+sR) if (sL+sR) else np.nan

    def _eoa(l,*_):
        r=abs(l[159][1]-l[145][1]); le=abs(l[386][1]-l[374][1])
        return r/le if le else np.nan

    def _fca(l,*_):
        R=[234,93,132,58,172,136,150]; L=[454,323,361,288,397,365,379]
        return abs(np.mean(l[R,0])-np.mean(l[L,0]))

    def _la(l,*_):
        idx=[61,146,91,181,84,17,314,405,321,375,291]; xs=l[idx,0]; c=(xs.min()+xs.max())/2
        L,R=xs[xs<c],xs[xs>=c]
        return np.nan if not(len(L) and len(R)) else abs(L.mean()-R.mean())/(L.mean()+R.mean())

    _era = lambda l,*_: abs(l[70][1]-l[300][1])

    def _sca(l,*_):
        r,lm,mid=l[61],l[291],l[13]
        return abs(np.arctan2(mid[1]-r[1],mid[0]-r[0]) -
                   np.arctan2(mid[1]-lm[1],mid[0]-lm[0]))

    def _hta(l,*_):
        dx,dy=l[159][0]-l[386][0],l[159][1]-l[386][1]
        return np.degrees(np.arctan2(dy,dx)) if dx else np.nan

    FEAT_FUNCS=[_smm,_dms,_eoa,_ns,_ja,_fca,_la,_era,_sca,_hta,_eci]
    COLS      =["SMM","DMS","EOA","NS","JA","FCA","LA","ERA","SCA","HTA","ECI"]

    # ─── iterate frames ───
    device="cuda" if torch.cuda.is_available() else "cpu"
    mtcnn = MTCNN(keep_all=True, device=device)
    rows, prev = [], None

    with mp.solutions.face_mesh.FaceMesh(
            static_image_mode=True, max_num_faces=1,
            refine_landmarks=False, min_detection_confidence=0.3) as fm:

        for fp in sorted(Path(frame_dir).glob("*.jpg")):
            rgb=cv2.cvtColor(cv2.imread(str(fp)), cv2.COLOR_BGR2RGB)
            boxes,_ = mtcnn.detect(rgb)
            if boxes is None:
                rows.append([np.nan]*11); prev=None; continue
            x1,y1,x2,y2 = map(int, boxes[0])
            pad=.2; w,h=x2-x1,y2-y1
            x1,y1=max(0,x1-int(w*pad)),max(0,y1-int(h*pad))
            x2,y2=min(rgb.shape[1],x2+int(w*pad)),min(rgb.shape[0],y2+int(h*pad))
            if x2<=x1 or y2<=y1:
                rows.append([np.nan]*11); prev=None; continue
            crop=rgb[y1:y2,x1:x2]
            res=fm.process(crop)
            if not res.multi_face_landmarks:
                rows.append([np.nan]*11); prev=None; continue
            lm=np.array([(int(p.x*crop.shape[1]), int(p.y*crop.shape[0]))
                          for p in res.multi_face_landmarks[0].landmark])
            rows.append([f(lm,prev) for f in FEAT_FUNCS]); prev=lm

    df=pd.DataFrame(rows, columns=COLS)

    # ─── 168-D video vector ───
    def _vec(d: pd.DataFrame):
        out=[]
        for c in COLS:
            s=d[c].dropna().values
            if len(s)<2:
                out.extend([np.nan]*15); continue
            mean,std=s.mean(),s.std(); mx,mn=s.max(),s.min(); rng=mx-mn
            sk,ku=skew(s),kurtosis(s); diff=np.diff(s)
            out.extend([mean,std,mx,mn,rng,sk,ku,
                        np.abs(diff).mean(),np.abs(diff).max(),
                        (np.abs(diff)>3*std).sum(),
                        np.where(np.abs(diff)>3*std)[0][0] if (np.abs(diff)>3*std).any() else len(s),
                        (diff>0).sum()/len(diff),(diff<0).sum()/len(diff),
                        len(find_peaks(s)[0]),len(find_peaks(-s)[0])])
        corr=lambda a,b: np.corrcoef(a,b)[0,1] if len(a)>1 and len(b)>1 else np.nan
        out.extend([
            corr(d["SMM"].dropna(), d["EOA"].dropna()),
            corr(d["NS"].dropna(),  d["JA"].dropna()),
            corr(d["LA"].dropna(),  d["ERA"].dropna())
        ])
        return np.asarray(out, dtype=float)

    prob  = float(model.predict_proba(_vec(df).reshape(1,-1))[0,1])
    label = int(prob >= thr)

    shutil.rmtree(tmp_root, ignore_errors=True)
    print(f"\nvideo   : {Path(video_path).name}")
    print(f"prob    : {prob:.3f}")
    print(f"label   : {label}  (1=안면마비 의심, 0=정상)")
    return {"video":Path(video_path).name, "probability":prob, "label":label}

# ── run: just call this line in your script / REPL
from 배포_final import facial_palsy   # 모듈 이름이 배포_final.py 라면
facial_palsy("test.mp4")              # artefact_path, fps 기본값 사용