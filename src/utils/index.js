import {Linking, Platform} from 'react-native';
// import Constants from 'expo-constants';
// import * as IntentLauncher from 'expo-intent-launcher';
import _ from 'lodash';

export function getFileNameFromPath(path) {
  return path.substring(path.lastIndexOf('/') + 1);
}

// const pkg = Constants.manifest.releaseChannel
//   ? Constants.manifest.android.package
//   : 'host.exp.exponent';
//
// export const openAppSettings = () => {
//   if (Platform.OS === 'ios') {
//     return Linking.openURL('app-settings:');
//   } else {
//     return IntentLauncher.startActivityAsync(
//       IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
//       {data: 'package:' + pkg},
//     );
//   }
// };


export const apiError2Message = (ex) => {
  const message = ex?.response?.data?.message;
  if (message) {
    return message;
  }
  const errors = ex?.response?.data?.errors;
  if (!errors) {
    return;
  }
  return _.map(errors, (value, key) => {
    return `${key}: ${value.join(',')}`
  }).join('\n');
}

export const sleep = (ms) => {
  return new Promise((resolve, reject) => setTimeout(() => resolve(ms), ms));
}