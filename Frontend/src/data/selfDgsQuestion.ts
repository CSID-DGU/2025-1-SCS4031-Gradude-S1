// src/data/selfDgsQuestion.ts

export type Option = {id: string; label: string; value: number};

export type Question = {
  id: string;
  text: string;
  type: 'input' | 'ox';
  options?: Option[];
  answer?: number | string;
};

const SELFDGSQUESTIONS: Question[] = [
  {
    id: 'orientationMonth',
    text: '오늘은 몇월입니까?',
    type: 'input',
  },
  {
    id: 'orientationAge',
    text: '만 나이로 몇살입니까?',
    type: 'input',
  },
  {
    id: 'gaze',
    text: '주시편위가 있나요?눈이 한쪽으로 돌아가 있거나 움직이지 않음',
    type: 'ox',
    options: [
      {id: 'gaze0', label: '정상', value: 0},
      {id: 'gaze1', label: '이상', value: 1},
    ],
  },
  {
    id: 'arm',
    text: '팔마비가 있나요?',
    type: 'ox',
    options: [
      {id: 'arm0', label: '없음', value: 0},
      {id: 'arm1', label: '있음', value: 1},
    ],
  },
];

export default SELFDGSQUESTIONS;
