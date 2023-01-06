import React, {useState} from 'react';
import {observer} from 'mobx-react';
import {Column, FormControl, Input} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ActionButton from '@/components/buttons/ActionButton';
import {object, string} from 'yup';
import {errorMessage} from '@/utils/Yup';
import FormInput from '@/components/FormInput';
import * as Api from '@/services/api';
import {useStore} from '@/hooks';
import {apiError2Message} from '@/utils';
import {assignIn} from 'lodash';
import {useNavigation} from '@react-navigation/native';

const yup = object().shape({
  oldPassword: string().
  trim()
    .required(errorMessage('oldPassword', 'Enter old password')),

  newPassword: string().
  trim()
    .required(errorMessage('newPassword', 'Enter new password')),

  confirmPassword: string().trim()
    .required(errorMessage('confirmPassword', 'Confirm password'))
    .test('match', errorMessage('confirmPassword', 'Password must match'), function(value){
      return this.parent.newPassword === value;
    })
});

const ChangePassword = () => {
  const [errors, setErrors] = useState({});
  const store = useStore();
  const nav = useNavigation();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onPressSave = async () => {
    try {
      store.hud.show();
      yup.validateSync({oldPassword, newPassword, confirmPassword}, {abortEarly: false});
      await Api.changePassword(oldPassword, newPassword);
      store.notification.showSuccess("Password was updated")
      nav.goBack();
    }catch(ex){
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
    }finally {
      store.hud.hide();
    }

  };

  return (
    <Column px={2} flex={1}>
      <KeyboardAwareScrollView flex={1}>
        <FormControl mt={3} isInvalid={!!errors.oldPassword}>
          <FormControl.Label>Old Password</FormControl.Label>
          <FormInput
            onChangeText={setOldPassword}
            value={oldPassword}
            secureTextEntry
          />
          <FormControl.ErrorMessage>{errors.oldPassword}</FormControl.ErrorMessage>
        </FormControl>

        <FormControl mt={3} isInvalid={!!errors.newPassword}>
          <FormControl.Label>New Password</FormControl.Label>
          <FormInput
            onChangeText={setNewPassword}
            value={newPassword}
            secureTextEntry
            textContentType='newPassword'
          />
          <FormControl.ErrorMessage>{errors.newPassword}</FormControl.ErrorMessage>
        </FormControl>

        <FormControl mt={3} isInvalid={!!errors.confirmPassword}>
          <FormControl.Label>Confirm Password</FormControl.Label>
          <FormInput
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            secureTextEntry
          />
          <FormControl.ErrorMessage>{errors.confirmPassword}</FormControl.ErrorMessage>
        </FormControl>

        <ActionButton mt={5} onPress={onPressSave}>Save</ActionButton>
      </KeyboardAwareScrollView>
    </Column>
  )
};

export default observer(ChangePassword);