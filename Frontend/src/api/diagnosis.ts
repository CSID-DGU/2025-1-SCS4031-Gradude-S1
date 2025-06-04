import axiosInstance from '@/api/axios';
import type {
  ApiResponse,
  DiagnosisResult,
  SurveyRequest,
  SurveyResultDto,
  DiagnosisHistoryItem,
  SingleDiagnosisResponse,
  DiagnosisHistoryResponse,
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
 * 2) 설문 전송 (설문을 보내면 병원 추천까지 포함된 SurveyResultDto를 반환)
 */
export const postSurvey = async (
  payload: SurveyRequest,
): Promise<SurveyResultDto> => {
  const {data} = await axiosInstance.post<ApiResponse<SurveyResultDto>>(
    '/api/diagnosis/survey',
    payload,
  );

  if (!data.isSuccess) {
    throw new Error(`Survey API failed: ${data.message}`);
  }
  return data.result;
};

/**
 * 3) 저장된 자가진단 단건 조회
 *    GET /api/diagnosis/{diagnosisId}
 */
export const getDiagnosisById = async (
  diagnosisId: number,
): Promise<SurveyResultDto> => {
  const {data} = await axiosInstance.get<SingleDiagnosisResponse>(
    `/api/diagnosis/${diagnosisId}`,
  );

  if (!data.isSuccess) {
    throw new Error(`Get Diagnosis API failed: ${data.message}`);
  }
  return data.result;
};

/**
 * 4) 유저별 자가진단 기록 있는 날짜 목록 조회
 *    GET /api/diagnosis/user/{userId}/list
 */
export const getDiagnosisHistory = async (
  userId: number,
): Promise<DiagnosisHistoryItem[]> => {
  const {data} = await axiosInstance.get<DiagnosisHistoryResponse>(
    `/api/diagnosis/user/${userId}/list`,
  );

  if (!data.isSuccess) {
    throw new Error(`Diagnosis History API failed: ${data.message}`);
  }
  return data.result;
};
