import React from 'react';
import {SafeAreaView, View, Text, StyleSheet, FlatList} from 'react-native';
import {colors} from '@/constants';
import {Hospital} from '@/types/hospital';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface HospitalCardProps {
  item: Hospital;
}
function HospitalCard({item}: HospitalCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.distance}>{item.distance}km</Text>
      </View>
      <Text style={styles.address}>{item.address}</Text>
      <View style={styles.infoRow}>
        <Ionicons name="call" size={16} color={colors.GRAY} />
        <Text style={styles.infoText}>{item.phoneNumber}</Text>
        <Ionicons
          name="time"
          size={16}
          color={colors.GRAY}
          style={styles.iconSpacing}
        />
        <Text
          style={[
            styles.infoText,
            item.isOpen ? styles.openText : styles.closedText,
          ]}>
          {item.isOpen ? '진료 중' : '진료 마감'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 110,
    backgroundColor: colors.WHITE,
    justifyContent: 'space-evenly',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.BLACK,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 4},
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  distance: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.MAINBLUE,
  },
  address: {
    fontSize: 14,
    color: colors.BLACK,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 4,
    marginRight: 16,
    fontSize: 14,
    color: colors.BLACK,
  },
  iconSpacing: {
    marginLeft: 0,
  },
  openText: {
    color: colors.GREEN,
    fontWeight: 'bold',
  },
  closedText: {
    color: colors.RED,
    fontWeight: 'bold',
  },
});

export default HospitalCard;
