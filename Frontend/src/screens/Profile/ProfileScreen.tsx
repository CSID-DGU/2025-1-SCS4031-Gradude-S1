import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors, profileNavigations} from '@/constants';
import {CompositeNavigationProp} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {MainTabParamList} from '@/navigations/tab/TabNavigator';
import {StackNavigationProp} from '@react-navigation/stack';
import {ProfileStackParamList} from '@/navigations/stack/ProfileStackNavigator';

type Navigation = CompositeNavigationProp<
  StackNavigationProp<ProfileStackParamList>,
  BottomTabNavigationProp<MainTabParamList>
>;

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CIRCLE_DIAMETER = SCREEN_WIDTH * 2;
const R = CIRCLE_DIAMETER / 2;

interface Props {
  navigation: Navigation;
}

export default function ProfileScreen({navigation}: Props) {
  // 메뉴 항목 배열에 onPress 함수 추가
  const menuItems = [
    {
      icon: 'document-text-outline',
      label: '개인정보약관',
      onPress: () => navigation.navigate(profileNavigations.INFO),
    },
    {
      icon: 'settings-outline',
      label: '설정',
    },
    {
      icon: 'log-out-outline',
      label: '로그 아웃',
      tint: colors.RED,
      onPress: () => {
        /* TODO : 로그아웃 */
      },
    },
    {
      icon: 'alert-circle-outline',
      label: '회원 탈퇴',
      tint: colors.RED,
      onPress: () => {
        /* TODO : 회원 탈퇴 */
      },
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundLayer} />
      <LinearGradient
        colors={['rgba(190,159,255,0.4)', colors.BLUE]}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 1}}
        style={styles.halfCircle}
      />

      {/* 아바타 + 이름 */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={48} color={colors.WHITE} />
        </View>
        <Text style={styles.name}>홍길동</Text>
      </View>

      {/* 카드 메뉴 */}
      <View style={styles.card}>
        {menuItems.map((item, i, arr) => (
          <React.Fragment key={item.label}>
            <TouchableOpacity style={styles.cardItem} onPress={item.onPress}>
              <View
                style={[
                  styles.itemIconBg,
                  item.tint
                    ? {backgroundColor: 'rgba(255, 69, 58, 0.1)'}
                    : undefined,
                ]}>
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={item.tint ?? colors.MAINBLUE}
                />
              </View>
              <Text
                style={[
                  styles.itemLabel,
                  item.tint ? {color: colors.RED} : undefined,
                ]}>
                {item.label}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={colors.GRAY} />
            </TouchableOpacity>
            {i < arr.length - 1 && <View style={styles.separator} />}
          </React.Fragment>
        ))}
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
    top: 120,
    left: -SCREEN_WIDTH / 2,
    width: CIRCLE_DIAMETER,
    height: CIRCLE_DIAMETER,
    borderRadius: R,
  },
  header: {
    alignItems: 'center',
    marginTop: 30,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 100,
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
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  itemIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(190,159,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  itemLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.BLACK,
    fontWeight: '500',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.LIGHTGRAY,
    marginLeft: 24 + 36 + 16, // 아이콘 영역만큼 들여쓰기
  },
});
