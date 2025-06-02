import axiosInstance from '@/api/axios';
import {
  ApiResponse,
  DiagnosisResult,
  SurveyRequest,
  SurveyResult,
  FinalRequest,
  FinalResult,
  FullDiagnosisRequest,
  FullDiagnosisResult,
} from '@/types/diagnosis';

/**
 * 1) 얼굴/음성 파일 업로드 → ApiResponse<DiagnosisResult>
 */
export const uploadDiagnosis = async (
  faceUri: string,
  speechUri: string,
): Promise<DiagnosisResult> => {
  const formData = new FormData();
  formData.append('faceFile', {
    uri: faceUri,
    type: 'image/mp4',
    name: 'face.mp4',
  } as any);
  formData.append('speechFile', {
    uri: speechUri,
    type: 'audio/wav',
    name: 'speech.wav',
  } as any);

  const {data} = await axiosInstance.post<ApiResponse<DiagnosisResult>>(
    '/api/diagnosis',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  if (!data.isSuccess) {
    throw new Error(`Diagnosis API failed: ${data.message}`);
  }

  return data.result;
};

/**
 * 2) 설문 데이터 전송 → ApiResponse<SurveyResult>
 */
export const postSurvey = async (
  payload: SurveyRequest,
): Promise<SurveyResult> => {
  const {data} = await axiosInstance.post<ApiResponse<SurveyResult>>(
    '/api/diagnosis/survey',
    payload,
  );

  if (!data.isSuccess) {
    throw new Error(`Survey API failed: ${data.message}`);
  }

  return data.result;
};

/**
 * TODO : 여기 없애거나 수정
 */
export const postFinal = async (
  payload: FinalRequest,
): Promise<FinalResult> => {
  const {data} = await axiosInstance.post<ApiResponse<FinalResult>>(
    '/api/diagnosis/final',
    payload,
  );

  // Final API도 isSuccess가 false일 수 있으니 조건 검사
  if (!data.isSuccess) {
    throw new Error(`Final API failed: ${data.message}`);
  }

  return data.result;
};

/**
 * TODO: 수정해야함
 */
export const fullDiagnosis = async (
  payload: FullDiagnosisRequest,
): Promise<FullDiagnosisResult> => {
  // 1) 얼굴/음성 업로드
  const diagnosis = await uploadDiagnosis(payload.faceUri, payload.speechUri);

  // 2) 설문 전송
  const surveyResult = await postSurvey(payload.survey);

  // 3) 최종 증상 전송
  const finalResult = await postFinal({symptoms: payload.symptoms});

  return {
    diagnosis,
    surveyResult,
    finalResult,
  };
};
