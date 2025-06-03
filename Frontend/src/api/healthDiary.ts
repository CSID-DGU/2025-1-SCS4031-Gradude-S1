import axiosInstance from './axios';
import type {
  HealthDiaryRequest,
  CreateHealthDiaryResponse,
  GetHealthDiaryResponse,
  GetHealthDiaryGraphResponse,
  GetHealthDiaryCalendarResponse,
} from '@/types/healthDiary';

// 1) 하루 기록 생성
export function createHealthDiary(data: HealthDiaryRequest) {
  return axiosInstance.post<CreateHealthDiaryResponse>(
    '/api/health-diary',
    data,
  );
}

// 2) diaryId로 하루 기록 조회
export function getHealthDiary(diaryId: number) {
  return axiosInstance.get<GetHealthDiaryResponse>(
    `/api/health-diary/${diaryId}`,
  );
}

// 3) 최근 5개 건강 점수 그래프 조회
export function getHealthDiaryGraph() {
  return axiosInstance.get<GetHealthDiaryGraphResponse>(
    '/api/health-diary/graph',
  );
}

// 4) 캘린더 조회 (year, month 쿼리 파라미터)
export function getHealthDiaryCalendar(year: number, month: number) {
  return axiosInstance.get<GetHealthDiaryCalendarResponse>(
    `/api/health-diary/calendar?year=${year}&month=${month}`,
  );
}
