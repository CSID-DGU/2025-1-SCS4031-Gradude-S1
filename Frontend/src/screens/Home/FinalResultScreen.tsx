import React, {useMemo} from 'react';
import {SafeAreaView, SectionList, StyleSheet, Text, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import FinalResultCard from '@/components/FinalResultCard';
import HospitalCard from '@/components/hospital/HospitalCard';
import CustomButton from '@/components/commons/CustomButton';
import HOSPITALS from '@/data/hospitals.json';
import {useNavigation} from '@react-navigation/native';
import {homeNavigations} from '@/constants';
import type {StackNavigationProp} from '@react-navigation/stack';
import type {Hospital} from '@/types/hospital';
import {HomeStackParamList} from '@/navigations/stack/HomeStackNavigator';

type VideoNavProp = StackNavigationProp<HomeStackParamList, 'ExerciseList'>;

type SectionListItem = Hospital;

type MySection = {
  title: string;
  data: SectionListItem[];
};

export default function FinalResultScreen() {
  const navigation = useNavigation<VideoNavProp>();
  const btnScale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{scale: btnScale.value}],
  }));

  // 병원 데이터 2개 추출
  const hospitalList = useMemo(() => (HOSPITALS as Hospital[]).slice(0, 2), []);

  // 섹션 배열 (병원만)
  const sections: MySection[] = useMemo(
    () => [{title: '🏥 가장 가까운 병원', data: hospitalList}],
    [hospitalList],
  );

  const renderItem = ({item}: {item: SectionListItem}) => (
    <HospitalCard item={item} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <SectionList<SectionListItem, MySection>
          sections={sections}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          renderSectionHeader={({section: {title}}) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          stickySectionHeadersEnabled={false}
          ListHeaderComponent={
            <View>
              <Text style={styles.title}>🔎 자가 진단 결과</Text>
              <FinalResultCard />
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>

      <Animated.View style={[styles.buttonWrapper, buttonStyle]}>
        <CustomButton
          label="확인"
          size="large"
          variant="filled"
          onPressIn={() => {
            btnScale.value = withTiming(0.95, {duration: 100});
          }}
          onPressOut={() => {
            btnScale.value = withTiming(1, {duration: 100});
            navigation.navigate(homeNavigations.MAIN_HOME);
          }}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'BACKGRAY',
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    marginBottom: 10,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 24,
    backgroundColor: 'transparent',
  },
});
