import React from 'react';
import {View, Text, Pressable, StyleSheet, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '@/constants';
import {Exercise} from '@/types/exercise';

interface ExerciseCardProps {
  item: Exercise;
  onPress: () => void;
}

export default function ExerciseCard({item, onPress}: ExerciseCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.durationRow}>
          <Ionicons name="time-outline" size={16} color={colors.GRAY} />
          <Text style={styles.duration}>{item.durationMins}분</Text>
        </View>
      </View>

      <View style={styles.thumbContainer}>
        <Image
          source={{uri: item.thumbnail as string}}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.playOverlay}>
          <Ionicons name="play-circle" size={40} color={colors.SKYBLUE} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 120,
    flexDirection: 'row',
    backgroundColor: colors.WHITE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.BLACK,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
    elevation: 4,
  },
  info: {
    flex: 1,
    paddingTop: 10,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.BLACK,
    marginBottom: 8,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    marginLeft: 6,
    fontSize: 14,
    color: colors.GRAY,
  },
  thumbContainer: {
    width: 140,
    height: '100%',
    borderRadius: 12,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -20}, {translateY: -20}],
  },
});
