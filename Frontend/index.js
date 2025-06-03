/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {LogBox} from 'react-native';

LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered',
]);

AppRegistry.registerComponent(appName, () => App);
