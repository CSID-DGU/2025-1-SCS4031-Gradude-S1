import {useMutation, useQuery} from '@tanstack/react-query';
import type {
  HealthDiaryRequest,
  HealthDiaryResult,
  HealthDiaryGraph,
  HealthDiaryCalendar,
} from '@/types/healthDiary';
import {
  createHealthDiary,
  getHealthDiary,
  getHealthDiaryGraph,
  getHealthDiaryCalendar,
} from '@/api/healthDiary';

// ————————————————
// 1) 하루 기록 생성 훅 (Mutation)
// ————————————————
export function useCreateHealthDiary() {
  return useMutation<
    HealthDiaryResult, // 성공 시 data 타입
    unknown, // error 타입 (필요하다면 구체화)
    HealthDiaryRequest // 변수로 받을 input 데이터 타입
  >({
    mutationFn: (requestBody: HealthDiaryRequest) =>
      createHealthDiary(requestBody).then(res => {
        if (!res.data.isSuccess) {
          throw new Error(res.data.message);
        }
        return res.data.result;
      }),
  });
}

// ————————————————
// 2) diaryId로 하루 기록 조회 훅 (Query)
// ————————————————
export function useGetHealthDiary(diaryId: number) {
  return useQuery<HealthDiaryResult, unknown>({
    queryKey: ['healthDiary', diaryId],
    queryFn: () =>
      getHealthDiary(diaryId).then(res => {
        if (!res.data.isSuccess) {
          throw new Error(res.data.message);
        }
        return res.data.result;
      }),
    enabled: !!diaryId, // diaryId가 있을 때만 실행
  });
}

// ————————————————
// 3) 최근 5개 건강 점수 그래프 조회 훅 (Query)
// ————————————————
export function useGetHealthDiaryGraph() {
  return useQuery<HealthDiaryGraph[], unknown>({
    queryKey: ['healthDiaryGraph'],
    queryFn: () =>
      getHealthDiaryGraph().then(res => {
        if (!res.data.isSuccess) {
          throw new Error(res.data.message);
        }
        return res.data.result;
      }),
  });
}

// ————————————————
// 4) 캘린더 조회 훅 (년/월 기준) (Query)
// ————————————————
export function useGetHealthDiaryCalendar(year: number, month: number) {
  return useQuery<HealthDiaryCalendar[], unknown>({
    queryKey: ['healthDiaryCalendar', year, month],
    queryFn: () =>
      getHealthDiaryCalendar(year, month).then(res => {
        if (!res.data.isSuccess) {
          throw new Error(res.data.message);
        }
        return res.data.result;
      }),
    enabled: !!year && !!month, // 둘 다 값이 들어왔을 때만 실행
  });
}
