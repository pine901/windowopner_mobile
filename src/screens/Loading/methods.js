import React from 'react';
import {useStore} from '@/hooks';
import {initializeStore} from '@/mst';
import {useNavigation} from '@react-navigation/native';
import {Screens} from '@/constants/Navigation';
import {Toast} from 'native-base';
import {Platform} from 'react-native';
import {resetWithScreen} from '@/services/navigation';

const tag = 'Loading::useViewModel() - ';
function useViewModel() {
  const store = useStore();
  const navigation = useNavigation();
  const [isLoading, setLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState();

  React.useEffect(() => {
    // Check the current order and determine the next screen to be navigated.
    async function initialize() {
      setLoading(true);
      try {
        // initialize the mobx store if not initialized
        if (!store.isInitialized) {
          await initializeStore();
        }
        if (store.user.isLoggedIn){
          // TODO Check the token by some api
          resetWithScreen(navigation, Screens.mainTabs);
        } else {
          resetWithScreen(navigation, Screens.login);
        }
      } catch (ex) {
        console.log(ex);
        resetWithScreen(navigation, Screens.login);
      } finally {
        setLoading(false);
      }
    }
    initialize().then();
  }, []);

  return {
    store,
    isLoading,
    hasError,
  };
}

export default useViewModel;
