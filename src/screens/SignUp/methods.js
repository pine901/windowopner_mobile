import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {useStore} from '@/hooks';
import {Screens} from '@/constants/Navigation';
import {resetWithScreen} from '@/services/navigation';
import {object, string} from 'yup';
import {errorMessage} from '@/utils/Yup';
import {assignIn} from 'lodash';
import * as Api from '@/services/api';
import {Toast} from 'native-base';
import {apiError2Message} from '@/utils';

const yup = object().shape({
  email: string().trim()
    .required(errorMessage('email', 'Enter e-mail address'))
    .email(errorMessage('email', 'Enter valid e-mail address'))
  ,
  password: string().
  trim()
    .required(errorMessage('password', 'Enter password')),

  confirmPassword: string().trim()
    .required(errorMessage('confirmPassword', 'Confirm password'))
    .test('match', errorMessage('confirmPassword', 'Password must match'), function(value){
      return this.parent.password === value;
    })
});

function useViewModel() {
  const navigation = useNavigation();
  const store = useStore();

  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();
  const [confirmPassword, setConfirmPassword] = React.useState();
  const [errors, setErrors] = React.useState({});

  const onPressLogin = () => {
    navigation.navigate(Screens.login);
  }

  const onPressSignUp = async () => {
    setErrors({});
    try{
      const values = yup.validateSync({email, password, confirmPassword}, {abortEarly: false});
      store.hud.show();
      await Api.signUp(values);

      store.notification.showSuccess('Sign up success')
      // on successful sign up, go to login
      navigation.navigate(Screens.login, {email});
    }catch (ex){
      const apiError = apiError2Message(ex);
      if (apiError) {
        store.notification.showError(apiError);
      }
      else if (ex.errors) {
        const _errors = assignIn({}, ...ex.errors);
        setErrors(_errors);
      } else {
        //Toast.show({title: 'Signup Failed', status: 'error'});
        store.notification.showError(ex.message);
      }
    }finally {
      store.hud.hide();
    }
  }

  return {
    store,
    onPressLogin,
    onPressSignUp,
    errors,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword
  };
}

export default useViewModel;
