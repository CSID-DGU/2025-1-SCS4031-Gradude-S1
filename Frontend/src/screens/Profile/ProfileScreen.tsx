// src/screens/Profile/ProfileScreen.tsx

import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import {colors, profileNavigations} from '@/constants';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from '@/navigations/tab/TabNavigator';
import {StackNavigationProp} from '@react-navigation/stack';
import {ProfileStackParamList} from '@/navigations/stack/ProfileStackNavigator';
import {useSelector} from 'react-redux';
import type {RootState} from '@/store';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Navigation = CompositeNavigationProp<
  StackNavigationProp<ProfileStackParamList>,
  BottomTabNavigationProp<MainTabParamList>
>;

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CIRCLE_DIAMETER = SCREEN_WIDTH * 2;
const R = CIRCLE_DIAMETER / 2;

export default function ProfileScreen() {
  const navigation = useNavigation<Navigation>();

  // Redux에서 저장된 프로필을 꺼냅니다.
  const userProfile = useSelector((state: RootState) => state.auth.userProfile);

  // 만약 userProfile이 없다면(예: 로딩 중이거나, 로그아웃되었거나) 간단히 빈 화면 처리
  if (!userProfile) {
    return (
      <SafeAreaView
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>프로필 정보를 불러오는 중입니다…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundLayer} />
      <View
        style={[
          styles.halfCircle,
          {
            top: 120,
            left: -SCREEN_WIDTH / 2,
            width: CIRCLE_DIAMETER,
            height: CIRCLE_DIAMETER,
            borderRadius: R,
          },
        ]}>
        {/* 그라디언트 대신 배경색 사용 예시 */}
        <View style={{flex: 1, backgroundColor: colors.BLUE, opacity: 0.4}} />
      </View>

      {/* 아바타 + 이름 */}
      <View style={styles.header}>
        {userProfile.profileImageUrl ? (
          <Image
            source={{uri: userProfile.profileImageUrl}}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={48} color={colors.WHITE} />
          </View>
        )}
        <Text style={styles.name}>{userProfile.nickname}</Text>
      </View>

      {/* (예시) 카드 메뉴 */}
      <View style={styles.card}>
        {/* 예시 메뉴: 개인정보약관, 설정, 로그아웃, 회원탈퇴 등 */}
        <Text style={{textAlign: 'center', marginTop: 20}}>…메뉴들…</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.BLUE,
  },
  halfCircle: {
    position: 'absolute',
  },
  header: {
    alignItems: 'center',
    marginTop: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.WHITE,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    color: colors.WHITE,
  },
  card: {
    flex: 1,
    marginTop: 60,
    backgroundColor: colors.WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 16,
  },
});
