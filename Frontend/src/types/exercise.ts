import {ImageSourcePropType} from 'react-native';

interface Exercise {
  id: string;
  title: string;
  durationMins: number;
  // 웹 URL(string) 또는 require() 반환 값(number) 둘 다 가능
  thumbnail: ImageSourcePropType;
  // 비디오 웹 URL(string) 또는 로컬 번들 번호(number)
  uri: string | number;
  videoId: string;
}
interface ExerciseSection {
  title: string;
  data: Exercise[];
}

export type {Exercise, ExerciseSection};
