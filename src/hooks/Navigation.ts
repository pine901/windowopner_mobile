import React from 'react';
import {get, isNil} from 'lodash';
import {
  useRoute,
} from '@react-navigation/native';

export function useParam<TData = any>(key: string): TData | undefined {
  const route = useRoute();
  if (route.params) {
    // @ts-ignore
    return route.params[key];
  }
}
