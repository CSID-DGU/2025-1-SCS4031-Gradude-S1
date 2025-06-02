export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// 기록 생성/조회용 요청 바디
export interface HealthDiaryRequest {
  drinking: number;
  smoking: number;
  exercise: number;
  diet: number;
  sleep: number;
}

// 개별 하루 기록 조회 시 받아오는 결과 타입
export interface HealthDiaryResult {
  diaryId: number;
  date: string; // 예: "2025-06-02"
  healthScore: number; // 합산 점수
  drinking: number;
  smoking: number;
  exercise: number;
  diet: number;
  sleep: number;
}

// “최근 5개” 그래프 조회용 타입
export interface HealthDiaryGraph {
  date: string; // 예: "2025-06-02"
  healthScore: number; // 해당 날짜의 점수
}

// 캘린더 조회용 타입 (년/월 기준으로 날짜와 id)
export interface HealthDiaryCalendar {
  date: string; // 예: "2025-06-02"
  diaryId: number;
}

// 각 엔드포인트별 ApiResponse<T> 타입
export type CreateHealthDiaryResponse = ApiResponse<HealthDiaryResult>;
export type GetHealthDiaryResponse = ApiResponse<HealthDiaryResult>;
export type GetHealthDiaryGraphResponse = ApiResponse<HealthDiaryGraph[]>;
export type GetHealthDiaryCalendarResponse = ApiResponse<HealthDiaryCalendar[]>;
