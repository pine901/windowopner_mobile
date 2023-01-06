import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeDevices from '@/screens/HomeDevices';
import {Screens} from '@/constants/Navigation';
import {Image} from 'native-base';
import {TouchableOpacity} from 'react-native';
import ProfileMain from '@/screens/ProfileMain';
import ChangePassword from '@/screens/ChangePassword';
import Settings from '@/screens/Settings';
const Stack = createStackNavigator();

const navHeaderBackImage = require('@/assets/images/navheader_left.png')

const ProfileTab = () => {
  return (
    <Stack.Navigator
      screenOptions={{

      }}
    >
      <Stack.Screen
        name={Screens.profileMain}
        component={ProfileMain}
        options={{
          title: 'Profile',
          headerLeft: () => {
            return <Image source={navHeaderBackImage} ml={4}/>
          }
        }}
      />
      <Stack.Screen
        name={Screens.changePassword}
        component={ChangePassword}
        options={{
          title: 'Change Password'
        }}
      />
      <Stack.Screen
        name={Screens.settings}
        component={Settings}
        options={{
          title: 'Settings'
        }}
      />
    </Stack.Navigator>
  );
}

export default ProfileTab;
