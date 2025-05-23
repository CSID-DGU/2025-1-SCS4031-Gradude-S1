from fastapi import FastAPI, UploadFile, File, HTTPException
from pathlib import Path
import shutil
import traceback
import uuid

from disorder_audio import predict  

app = FastAPI()

@app.post("/api/audio/predict")
def predict_audio(file: UploadFile = File(...)):
    try:
        # 안전한 파일 이름 생성 (충돌 방지)
        file_suffix = Path(file.filename).suffix or ".wav"
        filename = f"temp_{uuid.uuid4().hex}{file_suffix}"
        temp_path = Path(filename)

         # 업로드 파일 임시 저장
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 예측 수행
        prediction, probability = predict(str(temp_path), model_path="svm_model.pkl")
        return {
            "prediction": int(prediction),
            "probability": float(probability)
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
            