import {HospitalDetailDto} from '@/types/hospital';

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

/**
 * 1) /api/diagnosis (얼굴/음성 업로드) 결과의 실제 데이터 타입
 */
export interface DiagnosisResult {
  facePrediction: boolean;
  faceProbality: number;
  speechPrediction: boolean;
  speechProbality: number;
}

/**
 * 2) /api/diagnosis/survey 요청 바디
 */
export interface SurveyRequest {
  orientationMonth: number;
  orientationAge: number;
  gaze: 0 | 1;
  arm: 0 | 1;
}

/**
 * 3) /api/diagnosis/survey 응답 result 타입
 */
export interface SurveyResultDto {
  face: boolean;
  speech: boolean;
  orientation: number;
  gaze: number;
  arm: number;
  totalScore: number;
  totalScorePercentage: number;
  llmResult: string;
  hospitalList: HospitalDetailDto[];
}

/**
 * 4) /api/diagnosis/user/list 응답 내부 아이템 타입
 */
export interface DiagnosisHistoryItem {
  date: string; // ex. "2025-06-04"
  diagnosisId: number; // ex. 9007199254740991
}

/**
 * 실제 Survey API 호출 시 반환되는 형태
 * 예: ApiResponse<SurveyResultDto>
 */
export type SurveyResponse = ApiResponse<SurveyResultDto>;

/**
 * 진단 기록 목록 조회 시 반환되는 형태
 * 예: ApiResponse<DiagnosisHistoryItem[]>
 */
export type DiagnosisHistoryResponse = ApiResponse<DiagnosisHistoryItem[]>;

/**
 * 진단 단건 조회 시 반환되는 형태
 * (SurveyResultDto와 동일한 필드 구조를 리턴)
 * 예: ApiResponse<SurveyResultDto>
 */
export type SingleDiagnosisResponse = ApiResponse<SurveyResultDto>;
