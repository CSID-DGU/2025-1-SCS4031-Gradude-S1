// import React, {useMemo} from 'react';
// import {SafeAreaView, FlatList, StyleSheet, Text, View} from 'react-native';
// import ExerciseCard from '@/components/ExerciseCard';
// import {Exercise, ExerciseSection} from '@/types/exercise';
// import Random from '@/utils/random';
// import SECTIONS from '@/data/exercise.json';
// import {colors, homeNavigations} from '@/constants';
// import type {
//   StackNavigationProp,
//   StackScreenProps,
// } from '@react-navigation/stack';
// import {HomeStackParamList} from '@/navigations/stack/HomeStackNavigator';
// import {useNavigation} from '@react-navigation/native';

// type VideoNavProp = StackNavigationProp<HomeStackParamList, 'ExerciseList'>;

// function ExerciseList() {
//   const navigation = useNavigation<VideoNavProp>();
//   const allExercises = useMemo<Exercise[]>(() => {
//     return (SECTIONS as ExerciseSection[]).flatMap(section => section.data);
//   }, []);

//   const twoRandom = useMemo<Exercise[]>(
//     () => Random(allExercises),
//     [allExercises],
//   );

//   const handlePress = (item: Exercise) => {
//     navigation.navigate(homeNavigations.VIDEO_PLAYER, {
//       uri: item.uri,
//       videoId: item.videoId,
//       thumbnail: item.thumbnail,
//     });
//   };

//   return (
//     <View>
//       <FlatList<Exercise>
//         data={twoRandom}
//         keyExtractor={item => item.id}
//         renderItem={({item}) => (
//           <ExerciseCard item={item} onPress={() => handlePress(item)} />
//         )}
//         contentContainerStyle={styles.list}
//         scrollEnabled={false}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {flex: 1},
//   list: {marginBottom: 24},
// });

// export default ExerciseList;
