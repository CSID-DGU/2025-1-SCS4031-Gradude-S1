FROM python:3.11-slim

# OS 레벨 의존성 설치
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      build-essential \
      ffmpeg \
      libsndfile1 \
      libgl1 \
      libglib2.0-0 \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Python 의존성 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# 컨테이너 시작 시 FastAPI 앱 실행
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
