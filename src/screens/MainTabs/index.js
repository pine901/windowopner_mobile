import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeTab from '@/screens/HomeTab';
import {Screens} from '@/constants/Navigation';
import {Image} from 'native-base';
import AlertTab from '@/screens/AlertTab';
import ProfileTab from '@/screens/ProfileTab';

const Tab = createBottomTabNavigator();

const tabIconHome = require('@/assets/images/ic_tab_home.png');
const tabIconHomeActive = require('@/assets/images/ic_tab_home_active.png');
const tabIconAlert = require('@/assets/images/ic_tab_alert.png');
const tabIconAlertActive = require('@/assets/images/ic_tab_alert_active.png');
const tabIconProfile = require('@/assets/images/ic_tab_profile.png');
const tabIconProfileActive = require('@/assets/images/ic_tab_profile_active.png');


const MainTabs = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown: false, tabBarShowLabel: false}}>
      <Tab.Screen
        name={Screens.homeTab}
        component={HomeTab}
        options={{
          tabBarIcon: ({focused}) => {
            return <Image source={focused ? tabIconHomeActive: tabIconHome} h={6}/>
          }
        }}
      />
      <Tab.Screen
        name={Screens.alertTab}
        component={AlertTab}
        options={{
          tabBarIcon: ({focused}) => {
            return <Image source={focused ? tabIconAlertActive: tabIconAlert} h={6}/>
          }
        }}
      />
      <Tab.Screen
        name={Screens.profileTab}
        component={ProfileTab}
        options={{
          tabBarIcon: ({focused}) => {
            return <Image source={focused ? tabIconProfileActive: tabIconProfile} h={6}/>
          }
        }}
      />
    </Tab.Navigator>
  )
}

export default MainTabs;
