const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const customConfig = {
  transformer: {
    // keep your SVG transformer
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    // remove svg & json from the assetExts so they'll be parsed as modules
    assetExts: defaultConfig.resolver.assetExts.filter(
      ext => ext !== 'svg' && ext !== 'json',
    ),
    // add svg & json to the sourceExts so Metro will compile them
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg', 'json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
};

module.exports = wrapWithReanimatedMetroConfig(
  mergeConfig(defaultConfig, customConfig),
);
