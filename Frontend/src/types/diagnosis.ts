/**
 * 모든 API 응답에 공통으로 들어오는 필드
 */
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
 * 2) /api/diagnosis/survey 응답 result 타입
 */
export interface SurveyResult {
  result: any;
  face: boolean;
  speech: boolean;
  orientation: number;
  gaze: number;
  arm: number;
  totalScore: number;
}

/**
 * 3) /api/diagnosis/final 요청 바디
 */
export interface FinalRequest {
  symptoms: string;
}

/**
 * 3) /api/diagnosis/final 응답 result 타입
 */
export type FinalResult = string;

/** TODO : 수정해야 함
 * 4) fullDiagnosis() 호출 시 합쳐서 넘겨줄 파라미터
 */
export interface FullDiagnosisRequest {
  faceUri: string;
  speechUri: string;
  survey: SurveyRequest;
  symptoms: string;
}

/**
 * 4) fullDiagnosis()를 호출한 뒤 반환받는 최종 데이터
 */
export interface FullDiagnosisResult {
  diagnosis: DiagnosisResult;
  surveyResult: SurveyResult;
  finalResult: FinalResult;
}
