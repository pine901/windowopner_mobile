import React from 'react';
import {Column, Text, Image, FlatList, View, Row, Switch, Slider, Icon} from 'native-base';
import {observer} from 'mobx-react';

import useViewModel from './methods';
import ActionButton from '@/components/buttons/ActionButton';
import {useNavigation} from '@react-navigation/native';
import {Screens} from '@/constants/Navigation';
import {TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {confirmAlert} from '@/utils/alert';
import * as Api from '@/services/api';
import {apiError2Message} from '@/utils';
import {assignIn} from 'lodash';
import {useStore} from '@/hooks';
import {getCityDetailById, getStateDetailById} from '@/services/api';
import {queryWeather} from '@/services/weather';


const noDevices = require('@/assets/images/logo_no_devices.png');
const iconWifi = require('@/assets/images/ic_device_wifi.png');
const iconWindow = require('@/assets/images/ic_window.png');
const iconWeatherSunny = require('@/assets/images/ic_weather_sunny.png')

const HomeDevices = () => {
  const vm = useViewModel();
  return (
    <FlatList
      pt={3}
      flex={1}
      data={vm.devices}
      onRefresh={vm.onRefresh}
      refreshing={vm.isLoading}
      keyExtractor={(item) => item.id}
      renderItem={({item}) =>
        (<DeviceItem
          item={item}
          isExpanded={vm.devicesExpanded.includes(item.deviceId)}
          onToggleDeviceExpanded={() => vm.toggleDeviceExpanded(item.deviceId)}
          onPressConfig={() =>vm.onPressConfig(item)}
          />)
      }
      ListEmptyComponent={vm.isLoading? null : EmptyItemsView}
    >

    </FlatList>
  )
};

const DeviceItem = ({item, isExpanded, onToggleDeviceExpanded, onPressConfig}) => {
  const [sliderValue, setSliderValue] = React.useState(item.status ? 1 : 0);
  const [autoMode, setAutoMode] = React.useState(item.autoMode);
  const [weather, setWeather] = React.useState();
  const store = useStore();

  React.useEffect(() => {
    async function updateWeather(){
      let r;
      if (item.city) {
        r = await getCityDetailById(item.city.id);
      } else {
        r = await getStateDetailById(item.state.id);
      }
      const {latitude:lat, longitude: lng} = r;
      const result = await queryWeather({lat, lng});
      const {current: {temp_f, condition:{icon}}} = result;
      setWeather({
        temperature: temp_f,
        icon: `https:${icon}`
      });
    }
    updateWeather().then().catch(setWeather());
    setSliderValue(item.status ? 1 : 0);
    setAutoMode(item.autoMode);
  }, [item]);

  const onAutoSwitchChange = async (newValue) => {
    setAutoMode(newValue);
    if (!await confirmAlert('Are you sure you want to switch')) {
      // switch back to old mode
      return setAutoMode(!newValue);
    }
    try {
      // call api
      store.hud.show();
      await Api.setAutoMode(item.id, newValue);
    }catch(ex) {
      const apiError = apiError2Message(ex);
      if (apiError) {
        store.notification.showError(apiError);
      }
      else if (ex.errors) {
        const _errors = assignIn({}, ...ex.errors);
        setErrors(_errors);
      } else {
        store.notification.showError(ex.message);
      }
      // in case of error, revert back the auto mode
      return setAutoMode(!newValue);
    }finally {
      store.hud.hide();
    }
    setAutoMode(newValue);
  }

  const onOpenStatusChange = async (newValue) => {
    setSliderValue(newValue);
    if (!await confirmAlert('Are you sure?')) {
      // switch back to old mode
      return setSliderValue(newValue === 1 ? 0 : 1);
    }
    try {
      // call api
      store.hud.show();
      await Api.setOpenStatus(item.id, newValue === 1);
    }catch(ex) {
      const apiError = apiError2Message(ex);
      if (apiError) {
        store.notification.showError(apiError);
      }
      else if (ex.errors) {
        const _errors = assignIn({}, ...ex.errors);
        setErrors(_errors);
      } else {
        store.notification.showError(ex.message);
      }
      // in case of error, revert back the auto mode
      return setSliderValue(newValue === 1 ? 0 : 1);
    }finally {
      store.hud.hide();
    }
    setSliderValue(newValue);
  }

  return (
    <Column mx={4} mt={3} bg={'white'}>
      <TouchableOpacity onPress={onToggleDeviceExpanded} activeOpacity={1.0}>
        <Row h={45} bg={'#3590D5'} alignItems={'center'} px={4}>
          <Image source={iconWifi} mr={4}/>
          <Text color={'white'} flex={1} italic fontSize={'md'}>{item.name}</Text>
          <Image source={iconWindow}/>
        </Row>
      </TouchableOpacity>
      {
        isExpanded && (
          <Column px={5} mb={3}>
            <Row alignItems={'center'} justifyContent={'space-between'} mt={4} >
              <Row alignItems={'center'} space={1}>
                { !!weather &&
                  (
                    <>
                      <Image source={{uri:weather.icon}} w={'23px'} h={'23px'}/>
                      <Text bold fontSize={13} mr={-1}>{weather.temperature}</Text>
                      <Text fontSize={11} mt={-1}>℉</Text>
                    </>
                  )
                }
              </Row>
              <Row alignItems={'center'} mr={4} space={1}>
                <Text italic>AUTO</Text>
                <Switch defaultIsChecked={item.autoMode} onValueChange={onAutoSwitchChange} value={autoMode}/>
              </Row>
              <TouchableOpacity onPress={onPressConfig}>
                <Icon as={Feather} name={'settings'} size={'md'} mx={1} my={1}/>
              </TouchableOpacity>
            </Row>
            <Slider
              mt={5}
              size={'md'}
              minValue={0}
              maxValue={1}
              step={1}
              defaultValue={item.status ? 1 : 0}
              value={sliderValue}
              onChangeEnd={onOpenStatusChange}
            >
              <Slider.Track>
                <Slider.FilledTrack/>
              </Slider.Track>
              <Slider.Thumb/>
            </Slider>
            <Row justifyContent={'space-between'} >
              <Text italic ml={-3} color={'#8b8b8b'}>Close</Text>
              <Text italic bold fontSize={'md'} mt={2}>STATUS</Text>
              <Text italic mr={-3} color={'#8b8b8b'}>Open</Text>
            </Row>
          </Column>
        )
      }
    </Column>
  )
};

const EmptyItemsView = () => {
  const nav = useNavigation();
  return (
    <Column alignItems={'center'} justifyContent={'center'} mt={20}>
      <Image source={noDevices}/>
      <Text mt={3} italic color={'#8B8B88'} fontSize={21} textAlign={'center'}>{"It looks like your haven't\n added any device"}</Text>
      <ActionButton mt={5} onPress={() => nav.navigate(Screens.searchDevices)}>GET STARTED</ActionButton>
    </Column>
  );
}

export default observer(HomeDevices);
