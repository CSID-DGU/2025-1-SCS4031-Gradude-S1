import {useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@answered_dates';

export function useAnsweredDates() {
  const [answeredDates, setAnsweredDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // 1) 로드
  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) setAnsweredDates(JSON.parse(raw));
    } catch (e) {
      console.warn('답안 날짜 로드 실패', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2) 저장
  const save = useCallback(async (newDates: string[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newDates));
      setAnsweredDates(newDates);
    } catch (e) {
      console.warn('답안 날짜 저장 실패', e);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {answeredDates, loading, save};
}
