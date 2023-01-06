import React from 'react';
import {Checkbox, Column, Heading, Image, Input, Row, Text, Link, Button, FormControl} from 'native-base';
import {vs} from 'react-native-size-matters';
import {observer} from 'mobx-react';

import LoginBackground from '@/components/LoginBackground';
import {SafeAreaView} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import TitledInput from '@/components/TitledInput';
import ActionButton from '@/components/buttons/ActionButton';
import {useNavigation} from '@react-navigation/native';
import {Screens} from '@/constants/Navigation';
import {useInterval, useStore} from '@/hooks';
import * as Api from '@/services/api';
import {object, string} from 'yup';
import {errorMessage} from '@/utils/Yup';
import {apiError2Message} from '@/utils';
import {assignIn} from 'lodash';

const smallLogo = require('@/assets/images/logo-small.png');
const logoTitle = require('@/assets/images/logo-title.png');

const yupOtp = object().shape({
  email: string().trim()
    .required(errorMessage('email', 'Enter e-mail address'))
    .email(errorMessage('email', 'Enter valid e-mail address'))
  ,
  otp: string().trim()
    .required(errorMessage('otp', 'Enter OTP code')),
});

const yupEmail = object().shape({
  email: string().trim()
    .required(errorMessage('email', 'Enter e-mail address'))
    .email(errorMessage('email', 'Enter valid e-mail address'))
});

const ForgetPassword = () => {
  const nav = useNavigation();
  const [remainingSeconds, setRemainingSeconds] = React.useState(0);
  const [countDownInterval, setCountdownInterval] = React.useState(null);
  const [email, setEmail] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const disabled = remainingSeconds > 0;
  const store = useStore();
  const [errors, setErrors] = React.useState({});

  useInterval(() => {
    if (remainingSeconds > 1) {
      setRemainingSeconds(remainingSeconds - 1);
    } else {
      // Clear out countdown interval
      setCountdownInterval(null);
      setRemainingSeconds(0);
    }
  }, countDownInterval);

  const onPressSubmit = async () => {
    setErrors({});
    try {
      store.hud.show();
      yupOtp.validateSync({email, otp}, {abortEarly: false});
      await Api.resetPassword({email, otp});
      store.notification.showSuccess('Password was reset');
      nav.navigate(Screens.login);
    } catch (ex) {
      const apiError = apiError2Message(ex);
      if (apiError) {
        return store.notification.showError(apiError);
      }
      if (ex.errors) {
        const _errors = assignIn({}, ...ex.errors);
        return setErrors(_errors);
      }
      //Toast.show({title: 'Signup Failed', status: 'error'});
      store.notification.showError(ex.message);
    } finally {
      store.hud.hide();
    }
  };
  const onPressLogin = () => {
    nav.navigate(Screens.login);
  };


  const onPressSend = async () => {
    if (remainingSeconds > 0) return;
    setErrors({});
    try {
      store.hud.show();
      yupEmail.validateSync({email}, {abortEarly: false});
      await Api.forgotPassword(email);
      store.notification.showSuccess('The verification code has been sent to your e-mail address');
    } catch (ex) {
      const apiError = apiError2Message(ex);
      if (apiError) {
        return store.notification.showError(apiError);
      }
      if (ex.errors) {
        const _errors = assignIn({}, ...ex.errors);
        return setErrors(_errors);
      }
      //Toast.show({title: 'Signup Failed', status: 'error'});
      store.notification.showError(ex.message);
    } finally {
      store.hud.hide();
    }
    // set remaining seconds to 60
    setRemainingSeconds(60);
    setCountdownInterval(1000);
  };

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
            <Heading size={'lg'} fontWeight={800} mt={vs(60)}>
              Forgot Password
            </Heading>

            <FormControl isInvalid={!!errors.email}>
              <Row alignItems={'flex-end'}>
                <TitledInput
                  flex={1}
                  mt={vs(30)}
                  title={'Email address'}
                  inputProps={{
                    keyboardType: 'email-address',
                    placeholder: 'Email here...',
                    autoCorrect: 'none',
                    autoCapitalize: 'none',
                    value: email,
                    onChangeText: setEmail,
                  }}
                />
                <Button variant={'ghost'} mb={2} ml={2} disabled={disabled} onPress={onPressSend}
                        _text={{color: disabled ? '#8b8b8b' : 'primary.800'}} w={16}>
                  {disabled ? `${remainingSeconds}` : 'Send'}
                </Button>
              </Row>
              <FormControl.ErrorMessage>{errors.email}</FormControl.ErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.otp}>
              <TitledInput
                mt={vs(30)}
                title={'OTP Code'}
                inputProps={{
                  placeholder: 'Verification Code',
                  keyboardType: 'numeric'
                }}
              />
              <FormControl.ErrorMessage>{errors.otp}</FormControl.ErrorMessage>
            </FormControl>
            <ActionButton bold mt={vs(15)} onPress={onPressSubmit}>Submit</ActionButton>
            <Button
              variant={'ghost'}
              onPress={onPressLogin}
              alignSelf={'flex-end'}
              mt={5}
              _text={{
                fontStyle: 'italic',
                color: '#0741AD',
                fontWeight: 700,
                fontSize: 'md'
              }}>Go to login
            </Button>
          </Column>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </Column>
  );
};
export default observer(ForgetPassword);
