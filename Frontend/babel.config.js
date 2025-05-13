module.exports = {
  presets: [
    '@react-native/babel-preset', // ← 여기 하나만 남깁니다
  ],
  plugins: [
    'react-native-reanimated/plugin', // 기존 플러그인들은 그대로 둡니다
    [
      'module-resolver',
      {
        alias: {'@': './src'},
      },
    ],
  ],
};
