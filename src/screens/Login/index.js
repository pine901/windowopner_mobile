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

const Login = () => {
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
                Login Now
              </Heading>
              <FormControl isInvalid={!!vm.errors.email}>
                <TitledInput
                  mt={vs(30)}
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
                  mt={vs(30)}
                  title={'Password'}
                  inputProps={{
                    secureTextEntry: true,
                    placeholder: 'Password here...',
                    value: vm.password,
                    onChangeText: vm.setPassword,
                  }}
                />
                <FormControl.ErrorMessage>{vm.errors.password}</FormControl.ErrorMessage>
              </FormControl>

              <Row alignSelf={'stretch'} justifyContent={'flex-end'} alignItems={'center'} mt={vs(15)}>
                <Link _text={{color: '#3590D5', fontStyle: 'italic'}} onPress={vm.onPressForgetPassword}>Forgot Password?</Link>
              </Row>
              <ActionButton bold mt={vs(15)} onPress={vm.onPressLogin}>LOGIN</ActionButton>
              <Row justifyContent={'center'} alignItems={'center'} mt={vs(60)}>
                <Text fontStyle={'italic'} fontSize={'md'} color={'#1E293B'}>Don't have an account?</Text>
                <Button
                  variant={'ghost'}
                  onPress={vm.onPressSignUp}
                  _text={{
                  fontStyle: 'italic',
                  color: '#0741AD',
                  fontWeight: 700,
                  fontSize: 'md'
                }}>Sign Up</Button>
              </Row>
            </Column>
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </Column>
    )
  };
export default observer(Login);
