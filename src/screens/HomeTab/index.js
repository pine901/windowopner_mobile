import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeDevices from '@/screens/HomeDevices';
import {Screens} from '@/constants/Navigation';
import {IconButton, Image} from 'native-base';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import SearchDevices from '@/screens/SearchDevices';
import AddDevice from '@/screens/AddDevice';
import EditDevice from '@/screens/EditDevice';
const Stack = createStackNavigator();

const navHeaderBackImage = require('@/assets/images/navheader_left.png')
const iconAdd = require('@/assets/images/ic_add.png')

const HomeTab = () => {
  const nav = useNavigation();
  const onPressAdd = () => {
    nav.navigate(Screens.searchDevices);
  }
  return (
    <Stack.Navigator
      screenOptions={{

      }}
    >
      <Stack.Screen
        name={Screens.homeDevices}
        component={HomeDevices}
        options={{
          title: 'Home',
          headerLeft: () => {
            return <Image source={navHeaderBackImage} ml={4}/>
          },
          headerRight: () => {
            return <TouchableOpacity style={{padding: 12}} onPress={onPressAdd}><Image source={iconAdd}/></TouchableOpacity>
          }
        }}
      />
      <Stack.Screen
        name={Screens.addDevice}
        component={AddDevice}
        options={{title: 'Add Device'}}
      />
      <Stack.Screen
        name={Screens.editDevice}
        component={EditDevice}
        options={{title: 'Edit Device'}}
      />
      <Stack.Screen
        name={Screens.searchDevices}
        component={SearchDevices}
        options={{title: 'Search Devices'}}
      />
    </Stack.Navigator>
  );
}

export default HomeTab;
