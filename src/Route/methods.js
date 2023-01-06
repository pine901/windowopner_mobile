import React from 'react';
import {useStore} from '@/hooks';
import {Screens} from '@/constants/Navigation';

function useViewModel() {
  const store = useStore();
  const navigationRef = React.useRef();

  React.useEffect(() => {
    if (store.unauthorizedFlag > 0) {
       store.user.logOut();
       navigationRef.current.resetRoot({
         index: 0,
         routes: [{name: Screens.login}]
       })
    }
  },[store.unauthorizedFlag])

  return {
    navigationRef,
  };
}

export default useViewModel;
