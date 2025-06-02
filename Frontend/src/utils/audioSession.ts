// src/utils/audioSession.ts
import {Platform} from 'react-native';
import AudioSession from 'react-native-audio-session';

export async function prepareAudioSession() {
  if (Platform.OS !== 'ios') return;
  try {
    await AudioSession.setCategory('PlayAndRecord');
    await AudioSession.setMode('Measurement');
    await AudioSession.setActive(true);
    console.log('▶ AVAudioSession 활성화 완료');
  } catch (err) {
    console.warn('⚠️ AVAudioSession 활성화 중 오류:', err);
  }
}

export async function resetAudioSession() {
  if (Platform.OS !== 'ios') return;
  try {
    await AudioSession.setActive(false);
    console.log('▶ AVAudioSession 비활성화 완료');
  } catch (err) {
    console.warn('⚠️ AVAudioSession 비활성화 중 오류:', err);
  }
}
