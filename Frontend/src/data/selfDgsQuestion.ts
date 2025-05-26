export type Option = {id: string; label: string; value: number};

export type Question = {
  id: string;
  text: string;
  options: Option[];
  answer?: number;
};

const SELFDGSQUESTIONS: Question[] = [
  {
    id: 'q1',
    text: '눈을 뜨고 주변에 반응할 수 있나요?',
    options: [
      {id: 'q1o0', label: '정상 반응', value: 0},
      {id: 'q1o1', label: '약간 반응이 둔함', value: 1},
      {id: 'q1o2', label: '강한 자극에만 반응함', value: 2},
      {id: 'q1o3', label: '전혀 반응 없음', value: 3},
    ],
  },
  {
    id: 'q2',
    text: '지금 몇 월이고, 나이를 말할 수 있나요?',
    options: [
      {id: 'q2o0', label: '둘 다 맞음', value: 0},
      {id: 'q2o1', label: '하나만 맞음', value: 1},
      {id: 'q2o2', label: '둘 다 틀림', value: 2},
    ],
  },
  {
    id: 'q3',
    text: '눈동자가 한쪽으로 돌아가 있거나 움직이지 않나요?',
    options: [
      {id: 'q4o0', label: '양쪽 모두 정상적으로 움직임', value: 0},
      {id: 'q4o1', label: '한쪽만 부분적으로 움직임', value: 1},
      {id: 'q4o2', label: '한쪽으로 고정되어 움직이지 않음', value: 2},
    ],
  },
  {
    id: 'q4',
    text: '양쪽 시야 모두 보이나요?',
    options: [
      {id: 'q5o0', label: '시야 이상 없음', value: 0},
      {id: 'q5o1', label: '한쪽 시야가 조금 안 보임', value: 1},
      {id: 'q5o2', label: '한쪽 시야가 전혀 안 보임', value: 2},
      {id: 'q5o3', label: '양쪽 모두 안 보임', value: 3},
    ],
  },
  {
    id: 'q5',
    text: '왼팔을 들어 올릴 수 있나요?',
    options: [
      {id: 'q7o0', label: '잘 들 수 있음', value: 0},
      {id: 'q7o1', label: '잠깐 들었다가 내려감', value: 1},
      {id: 'q7o2', label: '들 수는 있지만 오래 못 듦', value: 2},
      {id: 'q7o3', label: '거의 들 수 없음', value: 3},
      {id: 'q7o4', label: '전혀 움직이지 않음', value: 4},
    ],
  },
  {
    id: 'q6',
    text: '오른팔을 들어 올릴 수 있나요?',
    options: [
      {id: 'q8o0', label: '잘 들 수 있음', value: 0},
      {id: 'q8o1', label: '잠깐 들었다가 내려감', value: 1},
      {id: 'q8o2', label: '들 수는 있지만 오래 못 듦', value: 2},
      {id: 'q8o3', label: '거의 들 수 없음', value: 3},
      {id: 'q8o4', label: '전혀 움직이지 않음', value: 4},
    ],
  },
  {
    id: 'q7',
    text: '왼다리를 들어 올릴 수 있나요?',
    options: [
      {id: 'q9o0', label: '잘 들 수 있음', value: 0},
      {id: 'q9o1', label: '잠깐 들었다가 내려감', value: 1},
      {id: 'q9o2', label: '들 수는 있지만 오래 못 듦', value: 2},
      {id: 'q9o3', label: '거의 들 수 없음', value: 3},
      {id: 'q9o4', label: '전혀 움직이지 않음', value: 4},
    ],
  },
  {
    id: 'q8',
    text: '오른다리를 들어 올릴 수 있나요?',
    options: [
      {id: 'q10o0', label: '잘 들 수 있음', value: 0},
      {id: 'q10o1', label: '잠깐 들었다가 내려감', value: 1},
      {id: 'q10o2', label: '들 수는 있지만 오래 못 듦', value: 2},
      {id: 'q10o3', label: '거의 들 수 없음', value: 3},
      {id: 'q10o4', label: '전혀 움직이지 않음', value: 4},
    ],
  },
  {
    id: 'q9',
    text: '좌우 감각 차이가 느껴지나요?',
    options: [
      {id: 'q12o0', label: '양쪽 모두 잘 느낌', value: 0},
      {id: 'q12o1', label: '한쪽이 덜 느낌', value: 1},
      {id: 'q12o2', label: '한쪽이 전혀 안 느낌', value: 2},
    ],
  },
  {
    id: 'q10',
    text: '그림 설명, 단어 말하기, 문장 읽기가 가능한가요?',
    options: [
      {id: 'q13o0', label: '정상적으로 말하고 이해함', value: 0},
      {id: 'q13o1', label: '약간 어눌하거나 이해 어려움', value: 1},
      {id: 'q13o2', label: '거의 말 못하거나 이해 못함', value: 2},
      {id: 'q13o3', label: '전혀 말하거나 이해 못함', value: 3},
    ],
  },
  {
    id: 'q11',
    text: '양쪽 자극을 동시에 느끼나요?',
    options: [
      {id: 'q15o0', label: '양쪽 다 인지함', value: 0},
      {id: 'q15o1', label: '한쪽만 인지함', value: 1},
      {id: 'q15o2', label: '한쪽은 거의 또는 전혀 인지 못함', value: 2},
    ],
  },
];

export default SELFDGSQUESTIONS;
