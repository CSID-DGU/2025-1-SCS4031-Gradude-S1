from fastapi import FastAPI, UploadFile, File, HTTPException
from pathlib import Path
import shutil
import traceback
import uuid

from facial_palsy import _facial_palsy_core

app = FastAPI()

@app.post("/api/video/predict")
def predict_video(file: UploadFile = File(...)):
    try:
        # 안전한 파일 이름 생성 (충돌 방지)
        file_suffix = Path(file.filename).suffix or ".mp4"
        temp_filename = f"temp_{uuid.uuid4().hex}{file_suffix}"
        temp_path = Path(temp_filename)

        # 업로드 파일 임시 저장
        with temp_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 예측 수행
        result = _facial_palsy_core(str(temp_path), artefact_path="xgb_stroke.pkl", fps=10)
        return {
            "prediction": int(result["label"]),
            "probability": float(result["probability"])
        }

    except Exception as e:
        # 에러 메시지와 traceback을 함께 반환
        tb = traceback.format_exc()
        raise HTTPException(
            status_code=500,
            detail={
                "error": str(e),
                "traceback": tb
            }
        )

    finally:
        # 임시 파일 삭제
        if temp_path.exists():
            temp_path.unlink()
