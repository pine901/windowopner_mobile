import Config from 'react-native-config';
import {Platform} from 'react-native';

const config = {
  apiEndPoint: Platform.OS === 'ios' ? Config.API_ENDPOINT_IOS : Config.API_ENDPOINT_ANDROID,
  ble: {
    serviceUUID: '00FF',
    characteristicUUID: 'FF01',
  },
  weatherApiKey: Config.WEATHER_API_KEY,
};

export default config;
