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
      {id: 'q1o1', label: '0~1잔 (가볍게)', value: 1},
      {id: 'q1o2', label: '1~3잔', value: 2},
      {id: 'q1o3', label: '3~6잔', value: 3},
      {id: 'q1o4', label: '6잔 이상', value: 4},
    ],
  },
  {
    id: 'q2',
    key: 'smoking',
    text: '오늘의 흡연량을 알려주세요',
    options: [
      {id: 'q3o1', label: '전혀 피지 않음(비흡연)', value: 1},
      {id: 'q3o2', label: '1-14개비', value: 2},
      {id: 'q3o3', label: '15-24개비', value: 3},
      {id: 'q3o4', label: '25개비 이상', value: 4},
    ],
  },
  {
    id: 'q3',
    key: 'exercise',
    text: '최근 일주일 이내 땀흘리는 운동을 몇분 하셨나요?',
    options: [
      {id: 'q2o1', label: '150분 이상', value: 1},
      {id: 'q2o2', label: '60-149분 이상', value: 2},
      {id: 'q2o3', label: '0-59분', value: 3},
    ],
  },

  {
    id: 'q4',
    key: 'diet',
    text: '오늘 하루 식단은 어떠셨나요?',
    options: [
      {id: 'q4o1', label: '건강식', value: 1},
      {id: 'q4o2', label: '고염분, 가공식품', value: 2},
    ],
  },
  {
    id: 'q5',
    key: 'sleep',
    text: '오늘 하루 몇 시간 주무셨나요?',
    options: [
      {id: 'q5o1', label: '7-8시간', value: 1},
      {id: 'q5o2', label: '6시간 미만', value: 2},
      {id: 'q5o3', label: '9시간 이상', value: 3},
    ],
  },
];
