import React from 'react';

import {useNavigation} from '@react-navigation/native';
import {useStore} from '@/hooks';

function useViewModel() {
  const navigation = useNavigation();
  const store = useStore();

  return {
    store,
  };
}

export default useViewModel;
