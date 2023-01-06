import React from 'react';
import {observer} from 'mobx-react';

import {
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import useViewModel from './methods';
import {Screens} from '@/constants/Navigation';
import Login from '@/screens/Login';
import SignUp from '@/screens/SignUp';
import MainTabs from '@/screens/MainTabs';
import ForgetPassword from '@/screens/ForgetPassword';
import Loading from '@/screens/Loading';

const Stack = createStackNavigator();

const Route = () => {
  const vm = useViewModel();
  return (
    <NavigationContainer
      theme={DefaultTheme}
      ref={vm.navigationRef}
    >
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name={Screens.loading} component={Loading}/>
        <Stack.Screen name={Screens.login} component={Login}/>
        <Stack.Screen name={Screens.signUp} component={SignUp}/>
        <Stack.Screen name={Screens.mainTabs} component={MainTabs}/>
        <Stack.Screen name={Screens.forgetPassword} component={ForgetPassword}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default observer(Route);
