import os
import torch
import numpy as np
import joblib
import logging
import soundfile as sf
import librosa
from transformers import WhisperProcessor, WhisperModel

# ✅ 로깅 설정
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

# ✅ 글로벌 캐싱 변수
_cached_scaler = None
_cached_classifier = None
_cached_processor = None
_cached_whisper_model = None
_cached_device = None

# ✅ 모델 및 스케일러 로드 (최초 1회만)
def load_model(model_path="svm_model.pkl"):
    global _cached_scaler, _cached_classifier

    if _cached_scaler is not None and _cached_classifier is not None:
        return _cached_scaler, _cached_classifier

    try:
        saved_objects = joblib.load(model_path)
        _cached_scaler = saved_objects["scaler"]
        _cached_classifier = saved_objects["classifier"]
        logging.info("모델 및 스케일러 로드 완료")
        return _cached_scaler, _cached_classifier
    except Exception as e:
        logging.error(f"모델 로딩 실패: {e}")
        raise

# ✅ Whisper 모델 로드 (최초 1회만)
def load_whisper_model():
    global _cached_processor, _cached_whisper_model, _cached_device

    if _cached_processor is not None and _cached_whisper_model is not None:
        return _cached_processor, _cached_whisper_model, _cached_device

    try:
        _cached_device = torch.device("cpu")
        _cached_processor = WhisperProcessor.from_pretrained("openai/whisper-base")
        _cached_whisper_model = WhisperModel.from_pretrained("openai/whisper-base").to(_cached_device).eval()
        logging.info("Whisper 모델 로드 완료")
        return _cached_processor, _cached_whisper_model, _cached_device
    except Exception as e:
        logging.error(f"Whisper 모델 로딩 실패: {e}")
        raise

# ✅ 오디오 파일 로딩 (librosa + soundfile 기반)
def load_audio(path, target_sr=16000):
    if not os.path.exists(path):
        logging.error(f"파일 경로 없음: {path}")
        raise FileNotFoundError(f"파일 경로가 존재하지 않습니다: {path}")

    try:
        waveform, sr = sf.read(path)

        if waveform.dtype != np.float32:
            waveform = waveform.astype(np.float32)

        if sr != target_sr:
            waveform = librosa.resample(waveform, orig_sr=sr, target_sr=target_sr)

        if len(waveform.shape) > 1:
            waveform = np.mean(waveform, axis=1)

        return torch.from_numpy(waveform)
    except Exception as e:
        logging.error(f"오디오 로딩 실패: {e}")
        raise

# ✅ Whisper 임베딩 추출
def extract_embedding(path, processor, model, device):
    waveform = load_audio(path)
    try:
        inputs = processor(waveform.numpy(), sampling_rate=16000, return_tensors="pt").to(device)

        with torch.no_grad():
            outputs = model(**inputs, decoder_input_ids=torch.tensor([[1]]))
            embedding = outputs.encoder_last_hidden_state.mean(dim=1).squeeze().cpu()
        return embedding.numpy()
    except Exception as e:
        logging.error(f"임베딩 추출 실패: {e}")
        raise

# ✅ 예측 수행 함수
def predict(path, model_path="svm_model.pkl"):
    try:
        scaler, classifier = load_model(model_path)
        processor, whisper_model, device = load_whisper_model()

        embedding = extract_embedding(path, processor, whisper_model, device)
        embedding_scaled = scaler.transform([embedding])

        prediction = classifier.predict(embedding_scaled)[0]
        if hasattr(classifier, "predict_proba"):
            probability = classifier.predict_proba(embedding_scaled)[0][prediction]
        else:
            probability = classifier.decision_function(embedding_scaled)[0]

        logging.info(f"예측 완료 - 결과: {prediction}, 확률: {probability:.4f}")
        return prediction, probability
    except Exception as e:
        logging.error(f"예측 실패: {e}")
        raise

# ✅ 커맨드라인 실행용 main
def main():
    import argparse

    parser = argparse.ArgumentParser(description="Whisper 기반 음성 분류기 (librosa 안정화 버전)")
    parser.add_argument("audio_path", type=str, help="분석할 .wav 또는 .pcm 파일 경로")
    parser.add_argument("--model_path", type=str, default="svm_model.pkl", help="SVM 모델 pkl 파일 경로")

    args = parser.parse_args()

    try:
        prediction, probability = predict(args.audio_path, args.model_path)
        print(f"🎯 예측 결과: {prediction}, 확률 점수: {probability:.4f}")
    except Exception as e:
        print(f"⚠️ 예측 실패: {e}")

if __name__ == "__main__":
    main()
