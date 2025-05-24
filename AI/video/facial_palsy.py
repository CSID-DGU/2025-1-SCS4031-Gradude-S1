#!/usr/bin/env python3
"""
Facial Palsy Inference – JSON‑based model version (full metadata/hyperparams)
==================================================

Usage
-----
python facial_palsy.py                        # 예제 영상 사용
python facial_palsy.py my_face.mp4            # 사용자 영상 분석
"""

from __future__ import annotations

import argparse
import logging
import multiprocessing as mp
import os
import shutil
import subprocess
import sys
import tempfile
import textwrap
import warnings
import contextlib
from pathlib import Path
from types import SimpleNamespace
from typing import Any, Dict

import faulthandler
faulthandler.enable()

import numpy as np
import pandas as pd
from scipy.stats import kurtosis, skew
from scipy.signal import find_peaks
import cv2
import torch
import base64
import json
import xgboost  # ✅ 반드시 전역 import 추가

with contextlib.redirect_stdout(open(os.devnull, 'w')):
    import mediapipe as mp_mediapipe
    from facenet_pytorch import MTCNN

logger = logging.getLogger("facial_palsy")
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter("[%(levelname)s] %(message)s")
handler.setFormatter(formatter)
logger.addHandler(handler)

os.environ.setdefault("KMP_DUPLICATE_LIB_OK", "True")
os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("OPENBLAS_NUM_THREADS", "1")
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

REQUIRED_PACKAGES: dict[str, str] = {
    "cv2": "opencv-python",
    "mediapipe": "mediapipe",
    "torch": "torch==2.2.2+cpu --extra-index-url https://download.pytorch.org/whl/cpu",
    "facenet_pytorch": "facenet-pytorch",
    "pandas": "pandas",
    "numpy": "numpy",
    "scipy": "scipy",
    "xgboost": "xgboost==1.7.6",
}

def _lazy_pip_install() -> None:
    for mod, pip_cmd in REQUIRED_PACKAGES.items():
        try:
            __import__(mod)
        except ImportError:
            logger.info(f"Missing {mod} → installing {pip_cmd}")
            subprocess.check_call(f"{sys.executable} -m pip install {pip_cmd}", shell=True)

def _load_json_model(path: str):
    with open(path) as f:
        artefact = json.load(f)

    raw_bytes = base64.b64decode(artefact["model_base64"])
    booster = xgboost.Booster()
    booster.load_model(bytearray(raw_bytes))

    xgb_params = artefact.get("xgb_params", {})
    clf = xgboost.XGBClassifier(**xgb_params)
    clf._Booster = booster

    return dict(
        model=clf,
        threshold=artefact["threshold"],
        feat_cols=artefact["feat_cols"],
        xgb_version=artefact.get("xgb_version", "unknown")
    )

def _facial_palsy_core(video_path: str, artefact_path: str, fps: int, out_q: mp.Queue | None = None) -> Dict[str, Any]:
    warnings.filterwarnings("ignore")
    _lazy_pip_install()

    artefact = _load_json_model(artefact_path)
    model = artefact["model"]
    thr = artefact["threshold"]

    def _extract_frames(vp: str, target_fps: int):
        tmp_root = tempfile.mkdtemp(prefix="fp_tmp_")
        dst_dir = Path(tmp_root, Path(vp).stem)
        dst_dir.mkdir()
        cap = cv2.VideoCapture(vp)
        if not cap.isOpened():
            raise RuntimeError(f"Cannot open video: {vp}")
        stride = max(int((cap.get(cv2.CAP_PROP_FPS) or 30) / target_fps), 1)
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

    _corr = lambda a, b: np.corrcoef(a, b)[0, 1] if (~np.isnan(a) & ~np.isnan(b)).sum() > 1 else np.nan
    _ns = lambda l, p: np.nan if p is None else abs(l[1][0] - p[1][0])
    _ja = lambda l, p: np.nan if p is None else abs(l[152][0] - p[152][0])
    _eci = lambda l, *_: (abs(l[159][1]-l[145][1]) + abs(l[386][1]-l[374][1])) / 2
    def _smm(l, p):
        if p is None: return np.nan
        dr, dl = np.linalg.norm(l[61] - p[61]), np.linalg.norm(l[291] - p[291])
        d = np.hypot(dr, dl)
        return (dr * dl) / d if d else np.nan
    def _dms(l, *_):
        idx = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291]
        mid = (l[61][0] + l[291][0]) / 2
        L = [l[i][0] for i in idx if l[i][0] < mid]
        R = [l[i][0] for i in idx if l[i][0] >= mid]
        sL, sR = sum(L), sum(R)
        return abs(sL - sR) / (sL + sR) if (sL + sR) else np.nan
    def _eoa(l, *_): return abs(l[159][1] - l[145][1]) / abs(l[386][1] - l[374][1])
    def _fca(l, *_):
        R, L = [234, 93, 132, 58, 172, 136, 150], [454, 323, 361, 288, 397, 365, 379]
        return abs(np.mean(l[R, 0]) - np.mean(l[L, 0]))
    def _la(l, *_):
        idx = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291]
        xs = l[idx, 0]
        c = (xs.min() + xs.max()) / 2
        L, R = xs[xs < c], xs[xs >= c]
        return np.nan if not (len(L) and len(R)) else abs(L.mean() - R.mean()) / (L.mean() + R.mean())
    _era = lambda l, *_: abs(l[70][1] - l[300][1])
    def _sca(l, *_):
        r, lm, mid = l[61], l[291], l[13]
        return abs(np.arctan2(mid[1]-r[1], mid[0]-r[0]) - np.arctan2(mid[1]-lm[1], mid[0]-lm[0]))
    def _hta(l, *_):
        dx, dy = l[159][0] - l[386][0], l[159][1] - l[386][1]
        return np.degrees(np.arctan2(dy, dx)) if dx else np.nan

    FEATS = [_smm, _dms, _eoa, _ns, _ja, _fca, _la, _era, _sca, _hta, _eci]
    COLS = ["SMM", "DMS", "EOA", "NS", "JA", "FCA", "LA", "ERA", "SCA", "HTA", "ECI"]

    frame_dir, tmp_root = _extract_frames(video_path, fps)
    device = "cuda" if torch.cuda.is_available() and os.environ.get("CUDA_VISIBLE_DEVICES", "0") != "" else "cpu"
    mtcnn = MTCNN(keep_all=True, device=device)
    rows, prev = [], None

    with mp_mediapipe.solutions.face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1, refine_landmarks=False, min_detection_confidence=0.3) as fm:
        for fp in sorted(Path(frame_dir).glob("*.jpg")):
            rgb = cv2.cvtColor(cv2.imread(str(fp)), cv2.COLOR_BGR2RGB)
            boxes, _ = mtcnn.detect(rgb)
            if boxes is None:
                rows.append([np.nan] * len(FEATS))
                prev = None
                continue
            x1, y1, x2, y2 = map(int, boxes[0])
            pad = 0.2
            w, h = x2 - x1, y2 - y1
            x1, y1 = max(0, x1 - int(w * pad)), max(0, y1 - int(h * pad))
            x2, y2 = min(rgb.shape[1], x2 + int(w * pad)), min(rgb.shape[0], y2 + int(h * pad))
            crop = rgb[y1:y2, x1:x2]
            res = fm.process(crop)
            if not res.multi_face_landmarks:
                rows.append([np.nan] * len(FEATS))
                prev = None
                continue
            lm = np.array([(int(p.x * crop.shape[1]), int(p.y * crop.shape[0])) for p in res.multi_face_landmarks[0].landmark])
            rows.append([f(lm, prev) for f in FEATS])
            prev = lm

    df = pd.DataFrame(rows, columns=COLS)

    def _vec(d: pd.DataFrame):
        out = []
        for c in COLS:
            s = d[c].dropna().values
            if len(s) < 2:
                out.extend([np.nan] * 15)
                continue
            mean, std = s.mean(), s.std()
            mx, mn = s.max(), s.min()
            rng = mx - mn
            sk, ku = skew(s), kurtosis(s)
            diff = np.diff(s)
            out.extend([
                mean, std, mx, mn, rng, sk, ku, abs(diff).mean(), abs(diff).max(),
                (abs(diff) > 3 * std).sum(),
                int(np.where(abs(diff) > 3 * std)[0][0]) if (abs(diff) > 3 * std).any() else len(s),
                (diff > 0).sum() / len(diff),
                (diff < 0).sum() / len(diff),
                len(find_peaks(s)[0]), len(find_peaks(-s)[0])
            ])
        out.extend([
            _corr(d["SMM"].values, d["EOA"].values),
            _corr(d["NS"].values, d["JA"].values),
            _corr(d["LA"].values, d["ERA"].values)
        ])
        return np.asarray(out, dtype=float)
    vec = _vec(df)
    vec = vec.reshape(1, -1)               # (1, n_features)  ← 1차원 → 2차원
    dmat = xgboost.DMatrix(vec, missing=np.nan)
    prob  = float(model._Booster.predict(dmat)[0])  # ← 확률 (binary:logistic)
    label = int(prob >= thr)

    shutil.rmtree(tmp_root, ignore_errors=True)
    payload = {"video": Path(video_path).name, "probability": prob, "label": label}
    if out_q is not None:
        out_q.put(payload)
    return payload

def _run_isolated(ns: SimpleNamespace):
    q: mp.Queue = mp.Queue()
    p: mp.Process = mp.Process(target=_facial_palsy_core, args=(ns.video, ns.artefact, ns.fps, q))
    p.start()
    p.join()
    if p.exitcode != 0:
        logger.error(f"Child process crashed with exit code {p.exitcode} (possible segfault)")
        raise RuntimeError(f"Child process crashed with exit code {p.exitcode} (possible segfault)")
    return q.get()

def _parse_cli():
    default_video = Path("affected_4.mp4")
    ag = argparse.ArgumentParser(prog="facial_palsy.py", formatter_class=argparse.RawDescriptionHelpFormatter, description=textwrap.dedent(__doc__))
    ag.add_argument("video", nargs="?", default=str(default_video), help="Input video path [default: %(default)s]")
    ag.add_argument("--artefact", default="xgb_stroke.json", help="Bundled model+meta json [default: %(default)s]")
    ag.add_argument("--fps", type=int, default=10, help="Target sampling FPS [default: %(default)s]")
    ag.add_argument("--no-isolate", action="store_true", help="Disable process isolation (danger mode)")
    return ag.parse_args()

def main() -> None:
    ns: SimpleNamespace = _parse_cli()  # type: ignore
    if ns.no_isolate:
        logger.warning("Running without isolation – segfault will crash interpreter!")
        result = _facial_palsy_core(ns.video, ns.artefact, ns.fps)
    else:
        result = _run_isolated(ns)

    logger.info("Results")
    logger.info("--------")
    logger.info(f"Video          : {result['video']}")
    logger.info(f"Probability    : {result['probability']:.3f}")
    logger.info(f"Predicted label: {result['label']}  (1 = suspected, 0 = normal)")

if __name__ == "__main__":
    mp.freeze_support()
    main()