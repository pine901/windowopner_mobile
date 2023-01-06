import React from 'react';
import {Alert, NativeEventEmitter, NativeModules, Platform, TouchableOpacity, PermissionsAndroid} from 'react-native';
import {Column, FlatList, Heading, Icon, Row, Text, useToast, View} from 'native-base';
import {observer} from 'mobx-react';
import {values} from 'mobx';
import config from '@/config';
import ActionButton from '@/components/buttons/ActionButton';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';

import BLEManager from 'react-native-ble-manager';
import {useStore} from '@/hooks';
import {sleep} from '@/utils';
import {Screens} from '@/constants/Navigation';
import {askLocationPermissionForBLEScan, checkBluetoothPermission} from '@/utils/bluetooth';

const BLEManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BLEManagerModule);


const SearchDevices = () => {
  const nav = useNavigation();
  const [isSearching, setSearching] = React.useState(false);
  const [bleStatus, setBLEStatus] = React.useState();
  const store = useStore();
  const toast = useToast();
  const data = values(store.bleDevices).map(d => {
    return {
      name: d.name,
      id: d.id
    };
  });

  const handleDiscoverPeripheral = (peripheral) => {
    console.log(peripheral);
    if (!peripheral.name) {
      return;
    }
    store.setBLEPeripheral(
      peripheral.id,
      peripheral
    );
  };

  // On component mount, start ble manager
  React.useEffect(() => {
    const listener1 = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
    const listener2 = bleManagerEmitter.addListener('BleManagerStopScan', async () => {
      setSearching(false);
    });
    const listener3 = bleManagerEmitter.addListener('BleManagerDidUpdateState', (args) => {
      setBLEStatus(args.state);
      if (args.state === 'off') {
      }
    });
    BLEManager.start({showAlert: false}).then(() => {
      console.log('Module initialized');
    }).catch(console.log);
    BLEManager.checkState();

    return () => {
      listener1.remove();
      listener2.remove();
      listener3.remove();
    };
  }, []);

  const onSearch = async () => {
    try {
      const isLocationGranted = await askLocationPermissionForBLEScan();
      if (!isLocationGranted) {
        return Alert.alert('', 'You have to enable access to location to scan bluetooth devices nearby.');
        return;
      }
      const isGranted = await checkBluetoothPermission();
      if (!isGranted) {
        return Alert.alert('', 'Permission to Bluetooth is denied. Please check in Settings App');
      }
      BLEManager.checkState();
      if (bleStatus !== 'on') {
        if (Platform.OS === 'ios') {
          return Alert.alert('', 'Bluetooth is turned off for the device. Please turn on to search devices near by.');
        } else {
          await BLEManager.enableBluetooth();
        }
      }

      await BLEManager.scan([config.ble.serviceUUID], 5, true);
      store.clearBLEPeripherals();
      setSearching(true);
    } catch (ex) {
      setSearching(false);
      console.log(ex);
    }
  };

  const onPressItem = async (item) => {
    store.hud.show();
    try {
      // Try to connect to device if it's not connected
      if (!item.isConnected) {
        // Try to sleep 5 seconds for iOS
        const value = await Promise.race([BLEManager.connect(item.id), sleep(5000)]);
        if (value) {
          // this means the connection timed out
          throw new Error('Connecting to device failed. Try searching again and connect');
        }
      }
      nav.navigate(Screens.addDevice, {peripheral: item});
    } catch (ex) {
      console.log(ex);
      toast.show({
        placement: 'top',
        description: ex.message
      });
    }
    store.hud.hide();

    //nav.navigate(Screens.addDevice, {deviceId: item.id});
  };

  return (
    <FlatList
      flex={1}
      refreshing
      ListHeaderComponent={(<Header isSearching={isSearching} devices={data} onPressedSearch={onSearch}/>)}
      ItemSeparatorComponent={Separator}
      renderItem={({item}) => (<Item item={item} onPress={() => onPressItem(item)}/>)}
      data={data}
    />
  );
};


const Header = ({isSearching, devices, onPressedSearch}) => {
  return (
    <Row justifyContent={'space-between'} px={3} my={3} alignItems={'center'}>
      <Text fontSize={'md'}>
        {isSearching ? 'Searching for Devices' : `Found ${devices.length} Devices`}
      </Text>
      {
        !isSearching &&
        (<TouchableOpacity style={{'padding': 3}} onPress={onPressedSearch}>
          <Icon as={Feather} name={'refresh-ccw'} size={'6'}/>
        </TouchableOpacity>)
      }
    </Row>
  );
};

const Item = ({item, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Row height={44} bg={'white'} alignItems={'center'} px={3}>
        <Text>{item.name}</Text>
      </Row>
    </TouchableOpacity>
  );
};

const Separator = () => {
  return (
    <View height={0} borderBottomWidth={'0.2px'} borderBottomColor={'#CCCCCC'}/>
  );
};

const EmptyComponent = () => {
  return (
    <Column mt={20}>
      <Heading textAlign={'center'} size={'md'} color={'#'}>No devices Found</Heading>
      <ActionButton alignSelf={'center'} mt={3}>Search Again</ActionButton>
    </Column>
  );
};

export default observer(SearchDevices);
