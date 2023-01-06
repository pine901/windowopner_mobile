import React, {useState} from 'react';
import {observer} from 'mobx-react';
import {Column, FormControl, Input, Row, Switch, Text, View} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ModalSelector from 'react-native-modal-selector';
import {assignIn} from 'lodash';
import config from '@/config';
import BLEManager from 'react-native-ble-manager';
import {object, string, number} from 'yup';
import ActionButton from '@/components/buttons/ActionButton';
import {useNavigation, useRoute} from '@react-navigation/native';
import * as Api from '@/services/api';
import {Screens} from '@/constants/Navigation';
import {errorMessage} from '@/utils/Yup';
import FormInput from '@/components/FormInput';
import {apiError2Message} from '@/utils';
import {useStore} from '@/hooks';
import {useGeoHooks} from '@/hooks/geohooks';
import { stringToBytes } from "convert-string";
import {connectPeripheral} from '@/utils/bluetooth';


const yup = object().shape({
  name: string().trim()
    .required(errorMessage('name', 'Enter name')),
  type: string().trim()
    .required(errorMessage('type', 'Select device type')),
  country: object().shape({
    id: string().required(),
    name: string().required()
  })
    .required(errorMessage('country', 'Select Country')),
  state: object().shape({
    id: string().required(),
    name: string().required()
  })
    .required(errorMessage('country', 'Select State')),
  city: object().shape({
    id: string(),
    name: string()
  }),
  lowTemp: number()
    .required(errorMessage('temperature', 'Enter temperature range')),
  highTemp: number()
    .required(errorMessage('temperature', 'Enter temperature range')),
  ssid: string().required(errorMessage('ssid', 'Set WIFI SSID name')),
  password: string().required(errorMessage('password', 'Set WIFI password'))
});

const AddDevice = () => {
  const route = useRoute();
  const store = useStore();
  const [name, setName] = useState('');
  const [country, setCountry] = useState();
  const [state, setState] = useState();
  const [city, setCity] = useState();
  const {countries, states, cities} = useGeoHooks(country, state);
  const [ssid, setSSID] = useState();
  const [password, setPassword] = useState();
  const [autoMode, setAutoMode] = useState(false);
  const [lowTemp, setLowTemp] = useState();
  const [highTemp, setHighTemp] = useState();
  const [errors, setErrors] = useState({});
  const nav = useNavigation();

  const onPressAdd = async () => {
    try {
      store.hud.show();
      const peripheral = route.params.peripheral;
      setErrors({});
      let values = {
        ssid,
        password,
        deviceId: peripheral.name,
        name,
        type: 'opener',
        country,
        state,
        autoMode,
        lowTemp: lowTemp,
        highTemp: highTemp,
      };
      if (city?.id) {
        values.city = city;
      }
      values = await yup.validate(values, {abortEarly: false});
      try {
        const data = {
          ssid,
          pass: password,
          auto: autoMode,
          low_temp:parseFloat(lowTemp),
          high_temp:parseFloat(highTemp),
        };
        const jsonData = JSON.stringify(data);
        const encodedData = stringToBytes(jsonData);

        await connectPeripheral(peripheral.id);
        await BLEManager.retrieveServices(peripheral.id, [config.ble.serviceUUID]);
        await BLEManager.startNotification(peripheral.id, config.ble.serviceUUID, config.ble.characteristicUUID)
        await BLEManager.write(
          peripheral.id,
          config.ble.serviceUUID,
          config.ble.characteristicUUID,
          encodedData,
          encodedData.length
        );
      }catch(ex){
        console.log(ex);
        throw new Error('Error while commuicating with device');
      }

      await Api.addDevice(values);
      // back to home scree
      nav.navigate(Screens.homeDevices,
        {
          refreshDevices: true
        });

      // Try to disconnect the device
      try {
        console.log("Trying to disconnect device");
        await BLEManager.disconnect(peripheral.id, true);
      }catch(ex){}

      store.notification.showSuccess('Device Added');
    } catch (ex) {
      const apiError = apiError2Message(ex);
      if (apiError) {
        store.notification.showError(apiError);
      }
      else if (ex.errors) {
        const _errors = assignIn({}, ...ex.errors);
        return setErrors(_errors);
      } else {
        store.notification.showError(ex.message);
      }
    } finally {
      store.hud.hide();
    }
  };
  return (
    <Column px={2} flex={1}>
      <KeyboardAwareScrollView flex={1}>
        <FormControl>
          <FormControl.Label>Device ID</FormControl.Label>
          <Text>{route.params?.peripheral?.name ?? ''}</Text>
        </FormControl>
        <FormControl mt={3} isInvalid={!!errors.ssid}>
          <FormControl.Label>SSID</FormControl.Label>
          <FormInput
            onChangeText={setSSID}
            value={ssid}
            autoCapitalize={'none'}
            autoComplete={'off'}
            autoCorrect={false}
          />
          <FormControl.ErrorMessage>{errors.ssid}</FormControl.ErrorMessage>
        </FormControl>
        <FormControl mt={3} isInvalid={!!errors.password}>
          <FormControl.Label>Password</FormControl.Label>
          <FormInput
            onChangeText={setPassword}
            value={password}
            autoCapitalize={'none'}
            autoComplete={'off'}
            autoCorrect={false}
          />
          <FormControl.ErrorMessage>{errors.password}</FormControl.ErrorMessage>
        </FormControl>
        <FormControl mt={3} isInvalid={!!errors.name}>
          <FormControl.Label>Name</FormControl.Label>
          <FormInput
            onChangeText={setName}
            value={name}
            autoCapitalize={'none'}
            autoComplete={'off'}
            autoCorrect={false}
          />
          <FormControl.ErrorMessage>{errors.name}</FormControl.ErrorMessage>
        </FormControl>
        <FormControl mt={3} isInvalid={!!errors.country}>
          <FormControl.Label>Country</FormControl.Label>
          <ModalSelector
            data={countries}
            keyExtractor= {item => item.id}
            labelExtractor= {item => `${item.emoji} ${item.name}`}
            animationType={'fade'}
            onChange={(option) => {
              // when country changed, clear out state and city
              if (country?.id !== option.id) {
                setState();
                setCity();
              }
              setCountry(option);
            }}
            cancelText={'Cancel'}
          >
            <FormInput editable={false} value={country?.name ?? ''}/>
          </ModalSelector>
          <FormControl.ErrorMessage>{errors.country}</FormControl.ErrorMessage>
        </FormControl>
        <FormControl mt={3} isInvalid={!!errors.state}>
          <FormControl.Label>State</FormControl.Label>
          <ModalSelector
            data={states}
            animationType={'fade'}
            keyExtractor= {item => item.id}
            labelExtractor= {item => item.name}
            onChange={(option) => {
              // when state changed, clear out city
              if (state?.id !== option.id) {
                setCity();
              }
              setState(option);
            }}
            cancelText={'Cancel'}
          >
            <FormInput editable={false} value={state?.name ?? ''}/>
          </ModalSelector>
          <FormControl.ErrorMessage>{errors.state}</FormControl.ErrorMessage>
        </FormControl>
        <FormControl mt={3} isInvalid={!!errors.city}>
          <FormControl.Label>City</FormControl.Label>
          <ModalSelector
            data={cities}
            keyExtractor= {item => item.id}
            labelExtractor= {item => item.name}
            animationType={'fade'}
            onChange={(option) => {
              setCity(option);
            }}
            cancelText={'Cancel'}
          >
            <FormInput editable={false} value={city?.name ?? ''}/>
          </ModalSelector>
          <FormControl.ErrorMessage>{errors.city}</FormControl.ErrorMessage>
        </FormControl>
        <Row alignItems={'center'} justifyContent={'space-between'} mt={2}>
          <FormControl.Label>Auto Mode</FormControl.Label>
          <Switch value={autoMode} onValueChange={setAutoMode}/>
        </Row>
        <FormControl mt={3} isInvalid={!!errors.temperature}>
          <FormControl.Label>Temperature Range</FormControl.Label>
          <Row space={3} alignItems={'center'}>
            <FormInput
              flex={1}
              value={lowTemp}
              onChangeText={setLowTemp}
              keyboardType={'numeric'}
            />
            <View height={'1px'} bg={'#8b8b8b'} width={4}/>
            <FormInput
              flex={1}
              value={highTemp}
              onChangeText={setHighTemp}
              keyboardType={'numeric'}
            />
          </Row>
          <FormControl.ErrorMessage>{errors.temperature}</FormControl.ErrorMessage>
        </FormControl>
        <ActionButton mt={5} onPress={onPressAdd}>Add</ActionButton>
      </KeyboardAwareScrollView>
    </Column>
  );
};

export default observer(AddDevice);