// import React, {useMemo} from 'react';
// import {SafeAreaView, FlatList, StyleSheet, Text, View} from 'react-native';
// import FinalResult from '@/components/FinalResultCard';
// import ExerciseCard from '@/components/ExerciseCard';
// import HospitalCard from '@/components/HospitalCard';
// import SECTIONS from '@/data/exercise.json';
// import HOSPITALS from '@/data/hospitals.json';
// import Random from '@/utils/random';
// import {useNavigation} from '@react-navigation/native';
// import {homeNavigations} from '@/constants';
// import type {StackNavigationProp} from '@react-navigation/stack';
// import type {Exercise} from '@/types/exercise';
// import type {Hospital} from '@/types/hospital';
// import {HomeStackParamList} from '@/navigations/stack/HomeStackNavigator';

// type VideoNavProp = StackNavigationProp<HomeStackParamList, 'ExerciseList'>;

// type CombinedItem = {
//   id: string;
//   type: 'hospital' | 'exercise';
//   data: Exercise | Hospital;
// };

// export default function FinalResultScreen() {
//   const navigation = useNavigation<VideoNavProp>();

//   // 병원 2개 추출
//   const hospitalItems = useMemo<CombinedItem[]>(
//     () =>
//       (HOSPITALS as Hospital[]).slice(0, 2).map(h => ({
//         id: h.id,
//         type: 'hospital',
//         data: h,
//       })),
//     [],
//   );

//   // 운동 데이터 전개 후 랜덤 pick 2
//   const exerciseItems = useMemo<CombinedItem[]>(() => {
//     const all = (SECTIONS as {data: Exercise[]}[]).flatMap(s => s.data);
//     return Random(all)
//       .slice(0, 2)
//       .map(e => ({
//         id: e.id,
//         type: 'exercise',
//         data: e,
//       }));
//   }, []);

//   const combined = useMemo(
//     () => [...hospitalItems, ...exerciseItems],
//     [hospitalItems, exerciseItems],
//   );

//   const renderItem = ({item}: {item: CombinedItem}) => {
//     if (item.type === 'hospital') {
//       return <HospitalCard item={item.data as Hospital} />;
//     }
//     return (
//       <ExerciseCard
//         item={item.data as Exercise}
//         onPress={() =>
//           navigation.navigate(homeNavigations.VIDEO_PLAYER, {
//             uri: (item.data as Exercise).uri,
//             videoId: (item.data as Exercise).videoId,
//             thumbnail: (item.data as Exercise).thumbnail,
//           })
//         }
//       />
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <FlatList
//         data={combined}
//         renderItem={renderItem}
//         keyExtractor={item => `${item.type}-${item.id}`}
//         showsVerticalScrollIndicator={false}
//         ListHeaderComponent={
//           <View style={styles.section}>
//             <Text style={styles.title}>🔎 자가 진단 결과</Text>
//             <FinalResult />
//             <Text style={styles.title}>🏥 가장 가까운 병원</Text>
//           </View>
//         }
//         ListFooterComponent={
//           <View style={styles.section}>
//             <Text style={styles.title}>💪🏻 오늘의 추천 운동</Text>
//           </View>
//         }
//         contentContainerStyle={styles.contentContainer}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {flex: 1},
//   contentContainer: {padding: 20, paddingBottom: 40},
//   section: {marginBottom: 20},
//   title: {fontSize: 18, fontWeight: 'bold', marginBottom: 12},
// });
