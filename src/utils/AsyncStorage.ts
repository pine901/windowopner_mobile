import AsyncStorage from '@react-native-async-storage/async-storage';

const _prefix = '@reth_wallet:';

export function getString(key: string) {
  return AsyncStorage.getItem(_prefix + key).catch(() => null);
}

export function putString(key: string, value: string) {
  return AsyncStorage.setItem(_prefix + key, value).catch();
}

export function getObject<T = any>(key: string): Promise<T | undefined | null> {
  return AsyncStorage.getItem(_prefix + key)
    .then(str => {
      if (str) {
        try {
          return JSON.parse(str) as T;
        } catch (ex) {}
      }
      return null;
    })
    .catch(() => null);
}

export function putObject(key: string, object: any) {
  return AsyncStorage.setItem(_prefix + key, JSON.stringify(object)).catch();
}

export function remove(key: string) {
  return AsyncStorage.removeItem(_prefix + key).catch();
}
