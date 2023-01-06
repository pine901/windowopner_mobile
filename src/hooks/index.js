import React from 'react';
import {StoreContext} from '@/mst/StoreProvider';
import {Platform, PlatformColor, useColorScheme} from 'react-native';

/**
 * useStores
 * @return {[type]} [description]
 */
export const useStore = () => React.useContext(StoreContext);

export const useBorderColor = () => {
  const scheme = useColorScheme();
  return scheme === 'dark' ? '#52525b' : '#18181b';
};

export const useSystemBgColor = () => {
  const scheme = useColorScheme();
  return React.useMemo(() => {
    if (Platform.OS === 'ios') {
      return PlatformColor('systemBackground');
    }
    return PlatformColor('?android:attr/colorBackground');
  }, [scheme]); // do not remove scheme dependency
};

export function useInterval(callback, delay) {
  const savedCallback = React.useRef()
  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback
  })
  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      if (typeof savedCallback?.current !== 'undefined') {
        savedCallback?.current()
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}