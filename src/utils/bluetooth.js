import {PERMISSIONS, check, checkMultiple, RESULTS, request} from 'react-native-permissions';
import {PermissionsAndroid, Platform} from 'react-native';
import BLEManager from 'react-native-ble-manager';
import {sleep} from '@/utils/index';
import config from '@/config';

export async function checkBluetoothPermission() {
  if (Platform.OS === 'ios') {
    const status = await check(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);
    if (status === RESULTS.BLOCKED || status === RESULTS.UNAVAILABLE) {
      return false;
    }
  } else if (Platform.OS === 'android') {
    const permissions = [PERMISSIONS.ANDROID.BLUETOOTH_SCAN];
    if (Platform.Version >= 29) {
      permissions.push(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }  else if(Platform.Version >= 23) {
      permissions.push(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
    }
    const statuses = await checkMultiple(permissions);
    for (let i = 0; i < statuses.length; i++) {
      if (statuses[i] === RESULTS.DENIED || statuses[i] === RESULTS.UNAVAILABLE || statuses[i] === RESULTS.BLOCKED) {
        return false;
      }
    }
  }
  return true;
}

export async function askLocationPermissionForBLEScan(){
  if (Platform.OS !== 'android') {
    return true;
  }
  if (Platform.Version < 23) {
    return true;
  }
  const permission = Platform.Version >= 29 ? PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION : PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION;
  let result = await PermissionsAndroid.check(permission);
  if (!result) {
    console.log(result);
    result = await PermissionsAndroid.request(permission);
    return result === 'granted';
  }
  return true;
}

export async function connectPeripheral(peripheralId) {
  const isConnected = await BLEManager.isPeripheralConnected(peripheralId, [config.ble.serviceUUID]);
  if (!isConnected) {
    // Try to sleep 2 seconds for iOS
    const value = await Promise.race([BLEManager.connect(peripheralId), sleep(3000)]);
    if (value) {
      // this means the connection timed out
      throw new Error('Connecting to device failed. Try searching again and connect');
    }
  }
}