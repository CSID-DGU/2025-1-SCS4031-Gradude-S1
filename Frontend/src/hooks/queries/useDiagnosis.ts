// src/hooks/queries/diagnosisHooks.ts

import {useQuery, useMutation} from '@tanstack/react-query';
import type {
  DiagnosisResult,
  SurveyRequest,
  SurveyResultDto,
  DiagnosisHistoryItem,
} from '@/types/diagnosis';
import {
  uploadDiagnosis,
  postSurvey,
  getDiagnosisById,
  getDiagnosisHistory,
} from '@/api/diagnosis';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';

/**
 * 1) 얼굴/음성 파일 업로드 → DiagnosisResult 반환하는 Mutation 훅
 *
 * 사용 예시:
 *   const {
 *     mutateAsync: uploadDiagnosisAsync,
 *     isLoading: isUploading,
 *     isError: uploadError,
 *     data: diagnosisResult,
 *   } = useUploadDiagnosis();
 *
 *   // 실제 호출:
 *   await uploadDiagnosisAsync({ faceUri: 'file://...', speechUri: 'file://...' });
 */
export function useUploadDiagnosis() {
  return useMutation<
    DiagnosisResult,
    Error,
    {faceUri: string; speechUri: string}
  >({
    mutationFn: ({faceUri, speechUri}) => uploadDiagnosis(faceUri, speechUri),
    onError: (err: Error) => {
      console.error('uploadDiagnosis failed:', err);
    },
  });
}

/**
 * 2) 설문 전송 → SurveyResultDto(병원 목록 포함) 반환하는 Mutation 훅
 *
 * 사용 예시:
 *   const {
 *     mutateAsync: postSurveyAsync,
 *     isLoading: isPostingSurvey,
 *     isError: postSurveyError,
 *     data: surveyResult,
 *   } = usePostSurvey();
 *
 *   // 실제 호출:
 *   await postSurveyAsync({
 *     orientationMonth: 2,
 *     orientationAge: 65,
 *     gaze: 1,
 *     arm: 0,
 *   });
 */
export function usePostSurvey() {
  return useMutation<SurveyResultDto, Error, SurveyRequest>({
    mutationFn: (payload: SurveyRequest) => postSurvey(payload),
    onError: (err: Error) => {
      console.error('postSurvey failed:', err);
    },
  });
}

/**
 * 3) 진단 ID로 단건 조회 → SurveyResultDto 반환하는 Query 훅
 *
 * 사용 예시:
 *   const {
 *     data: diagnosisData,
 *     isLoading: isLoadingDiagnosis,
 *     isError: isDiagnosisError,
 *     refetch: refetchDiagnosis,
 *   } = useDiagnosisById(diagnosisId);
 */
export function useDiagnosisById(diagnosisId: number) {
  return useQuery<SurveyResultDto, Error>({
    queryKey: ['diagnosis', diagnosisId],
    queryFn: () => getDiagnosisById(diagnosisId),
    enabled: diagnosisId !== undefined && diagnosisId !== null,
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시를 신선 상태로 유지
    // onError: (err: Error) => {
    //   console.error('getDiagnosisById failed:', err);
    // },
  });
}

/**
 * 4) 유저별 진단 기록 목록 조회 → DiagnosisHistoryItem[] 반환하는 Query 훅
 *
 * 사용 예시:
 *   const {
 *     data: historyData,
 *     isLoading: isLoadingHistory,
 *     isError: isHistoryError,
 *     refetch: refetchHistory,
 *   } = useDiagnosisHistory(userId);
 */
// Optionally define UseDiagnosisOptions if not imported from elsewhere
type UseDiagnosisOptions = {
  enabled?: boolean;
};

export function useDiagnosisHistory() {
  return useQuery<DiagnosisHistoryItem[], Error>({
    queryKey: ['diagnosisHistory'], // 고정된 키만 사용
    queryFn: () => getDiagnosisHistory(), // userId 없이 호출
    enabled: true, // 항상 실행하거나, 필요 시 이 값을 동적으로 바꿔도 됩니다
  });
}
