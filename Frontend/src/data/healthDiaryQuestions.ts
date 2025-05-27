export type Option = {
  id: string;
  label: string;
  value: number;
};

export type Question = {
  id: string;
  key: string;
  text: string;
  options: Option[];
  answer?: number;
};

export const HEALTHDAIRYQUESTIONS: Question[] = [
  {
    id: 'q1',
    key: 'drinking',
    text: '오늘의 음주량을 소주 기준으로 알려주세요',
    options: [
      {id: 'q1o1', label: '한 병 이상 (과음)', value: 1},
      {id: 'q1o2', label: '한 병 정도', value: 2},
      {id: 'q1o3', label: '반 병 정도 (3-4잔)', value: 3},
      {id: 'q1o4', label: '1~2잔 정도 (가볍게)', value: 4},
      {id: 'q1o5', label: '전혀 마시지 않음', value: 5},
    ],
  },
  {
    id: 'q2',
    key: 'exercise',
    text: '오늘의 운동량을 알려주세요',
    options: [
      {id: 'q2o1', label: '전혀 안함', value: 1},
      {id: 'q2o2', label: '가볍게 10분 이하', value: 2},
      {id: 'q2o3', label: '30분 정도', value: 3},
      {id: 'q2o4', label: '1시간 정도', value: 4},
      {id: 'q2o5', label: '1시간 이상 활발히', value: 5},
    ],
  },
  {
    id: 'q3',
    key: 'smoking',
    text: '오늘의 흡연량을 알려주세요',
    options: [
      {id: 'q3o1', label: '많이 핌 (1갑 이상)', value: 1},
      {id: 'q3o2', label: '반 갑 정도', value: 2},
      {id: 'q3o3', label: '소량 (몇 개비)', value: 3},
      {id: 'q3o4', label: '1개비 이하', value: 4},
      {id: 'q3o5', label: '전혀 피지 않음', value: 5},
    ],
  },
  {
    id: 'q4',
    key: 'snack',
    text: '오늘 간식 섭취 빈도를 알려주세요',
    options: [
      {id: 'q4o1', label: '매우 자주 (3회 이상)', value: 1},
      {id: 'q4o2', label: '자주 (2회)', value: 2},
      {id: 'q4o3', label: '보통 (1회)', value: 3},
      {id: 'q4o4', label: '가끔 (몇 개)', value: 4},
      {id: 'q4o5', label: '전혀 안 먹음', value: 5},
    ],
  },
  {
    id: 'q5',
    key: 'vegetable',
    text: '오늘 야채 섭취 빈도를 알려주세요',
    options: [
      {id: 'q5o1', label: '전혀 안 먹음', value: 1},
      {id: 'q5o2', label: '가끔 (몇 조각)', value: 2},
      {id: 'q5o3', label: '보통 (한 끼)', value: 3},
      {id: 'q5o4', label: '자주 (2회 이상)', value: 4},
      {id: 'q5o5', label: '매우 자주 (3회 이상)', value: 5},
    ],
  },
];
