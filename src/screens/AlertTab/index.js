import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Screens} from '@/constants/Navigation';
import {Image} from 'native-base';
import AlertHistory from '@/screens/AlertHistory';

const Stack = createStackNavigator();

const navHeaderBackImage = require('@/assets/images/navheader_left.png')

const AlertTab = () => {
  return (
    <Stack.Navigator
      screenOptions={{

      }}
    >
      <Stack.Screen
        name={Screens.alertHistory}
        component={AlertHistory}
        options={{
          title: 'Messages',
          headerLeft: () => {
            return <Image source={navHeaderBackImage} ml={4}/>
          }
        }}
      />
    </Stack.Navigator>
  );
}

export default AlertTab;
