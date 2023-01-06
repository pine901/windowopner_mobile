import React from 'react';
import {Checkbox, Column, Heading, Image, Input, Row, Text, Link, Button, FormControl} from 'native-base';

import {vs} from 'react-native-size-matters';
import {observer} from 'mobx-react';

import useViewModel from './methods';
import LoginBackground from '@/components/LoginBackground';
import {SafeAreaView} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import TitledInput from '@/components/TitledInput';
import ActionButton from '@/components/buttons/ActionButton';

const smallLogo = require('@/assets/images/logo-small.png');
const logoTitle = require('@/assets/images/logo-title.png');

const SignUp = () => {
  const vm = useViewModel();
  return (
    <Column flex={1}>
      <LoginBackground/>
      <SafeAreaView flex={1}>
        <KeyboardAwareScrollView style={{flex: 1}}>
          <Column flex={1} px={4} mt={8}>
            <Row>
              <Image source={smallLogo} mr={3}/>
              <Image source={logoTitle}/>
            </Row>
            <Heading size={'xl'} fontWeight={800} mt={vs(60)}>
              Sign Up
            </Heading>
            <FormControl isInvalid={!!vm.errors.email}>
              <TitledInput
                mt={vs(10)}
                title={'Email address'}
                inputProps={{
                  value: vm.email,
                  onChangeText: vm.setEmail,
                  keyboardType: 'email-address',
                  placeholder: 'Email here...',
                  _input: {
                    autoCapitalize: 'none',
                    autoCorrect: false,
                    autoComplete: 'off'
                  }
                }}
              />
              <FormControl.ErrorMessage>{vm.errors.email}</FormControl.ErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!vm.errors.password}>
              <TitledInput
                mt={vs(10)}
                title={'Password'}
                inputProps={{
                  secureTextEntry: true,
                  value: vm.password,
                  onChangeText: vm.setPassword,
                  placeholder: 'Password here...',
                  textContentType: 'newPassword',
                }}
              />
              <FormControl.ErrorMessage>{vm.errors.password}</FormControl.ErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!vm.errors.confirmPassword}>
              <TitledInput
                mt={vs(10)}
                title={'Confirm Password'}
                inputProps={{
                  secureTextEntry: true,
                  value: vm.confirmPassword,
                  onChangeText: vm.setConfirmPassword,
                  placeholder: 'Password here...',
                  textContentType: 'password',
                }}
              />
              <FormControl.ErrorMessage>{vm.errors.confirmPassword}</FormControl.ErrorMessage>
            </FormControl>
            <ActionButton bold mt={vs(30)} onPress={vm.onPressSignUp}>SIGN UP</ActionButton>
            <Row justifyContent={'center'} alignItems={'center'} mt={vs(35)}>
              <Text fontStyle={'italic'} fontSize={'md'} color={'#1E293B'}>Already have an account?</Text>
              <Button
                variant={'ghost'}
                onPress={vm.onPressLogin}
                _text={{
                  fontStyle: 'italic',
                  color: '#0741AD',
                  fontWeight: 700,
                  fontSize: 'md'
                }}>Login
              </Button>
            </Row>
          </Column>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </Column>
  )
};
export default observer(SignUp);
