import React, {useState} from 'react';
import {observer} from 'mobx-react';
import {Column, FormControl, Input, Text} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ActionButton from '@/components/buttons/ActionButton';
import {object, string} from 'yup';
import {errorMessage} from '@/utils/Yup';
import FormInput from '@/components/FormInput';
import {useStore} from '@/hooks';
import * as Api from '@/services/api';
import {apiError2Message} from '@/utils';
import {assignIn} from 'lodash';
import {useNavigation} from '@react-navigation/native';

const Settings = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const store = useStore();
  const nav = useNavigation();

  const loadProfile = async () => {
    try {
      store.hud.show();
      const {name, address} = await Api.getUserProfile();
      setName(name);
      setAddress(address);
    }catch(ex){
      const apiError = apiError2Message(ex);
      if (apiError) {
        store.notification.showError(apiError);
      } else {
        store.notification.showError(ex.message);
      }
    }
    finally {
      store.hud.hide();
    }
  }

  React.useEffect(() => {
    loadProfile().then().catch(console.log);
  }, []);

  const onPressSave = async () => {
    try {
      store.hud.show();
      await Api.updateUserProfile({name, address})
      store.notification.showSuccess("Profile updated");
      nav.goBack();
    }catch(ex){
      const apiError = apiError2Message(ex);
      if (apiError) {
        store.notification.showError(apiError);
      } else {
        store.notification.showError(ex.message);
      }
    }
    finally {
      store.hud.hide();
    }
  };

  return (
    <Column px={2} flex={1}>
      <KeyboardAwareScrollView flex={1}>
        <FormControl mt={3}>
          <FormControl.Label>Email</FormControl.Label>
          <Text>{store.user.email}</Text>
        </FormControl>
        <FormControl mt={3}>
          <FormControl.Label>Full Name</FormControl.Label>
          <FormInput
            onChangeText={setName}
            value={name}
            textContentType={'name'}
            autoCapitalize={'words'}
          />
        </FormControl>
        <FormControl mt={3}>
          <FormControl.Label>Address</FormControl.Label>
          <FormInput
            onChangeText={setAddress}
            value={address}
          />
        </FormControl>
        <ActionButton mt={5} onPress={onPressSave}>Save</ActionButton>
      </KeyboardAwareScrollView>
    </Column>
  )
};

export default observer(Settings);