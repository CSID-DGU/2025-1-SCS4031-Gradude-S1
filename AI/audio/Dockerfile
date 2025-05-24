FROM python:3.11-slim

# 시스템 종속성 설치 (torchaudio, ffmpeg 등에 필요)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      libsndfile1 \
      ffmpeg \
      && rm -rf /var/lib/apt/lists/*

# 작업 디렉터리 설정
WORKDIR /app

# Python 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
 
COPY . .

EXPOSE 8000

# 컨테이너 시작 시 FastAPI 앱 실행
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
