from fastapi import FastAPI, UploadFile, File, HTTPException
from pathlib import Path
import shutil
import traceback

from disorder_audio import predict  

app = FastAPI()

@app.post("/predict")
async def predict_audio(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    
    # 업로드 파일 임시 저장
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        prediction, probability = predict(temp_path, model_path="svm_model.pkl")
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
        if Path(temp_path).exists():
            Path(temp_path).unlink()