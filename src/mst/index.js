// Just create with empty information at first, and later load from async storage
import * as Storage from '@/utils/AsyncStorage';
import {applySnapshot, onPatch, types} from 'mobx-state-tree';
import Store from './Store';
import {toJS} from 'mobx';

const store = Store.create({
  notification: {},
  hud: {},
  user: {},
  bleDevices: {},
  isInitialized: false,
});

const storageKey = 'user.preference';

// Initialize from store, just return the promise.
const initializeStore = async () => {
  try {
    const snap = await Storage.getObject(storageKey);
    // try to save
    applySnapshot(store.user, snap);
  }catch(ex) {
    console.log('Load user preference error - ', ex);
  }
  store.setInitialized();
};

let saveTimeoutHandler;

// Write update to storage when something changed on store
export function scheduleWrite2Storage() {
  if (saveTimeoutHandler) {
    clearTimeout(saveTimeoutHandler);
  }
  // Save to local storage
  saveTimeoutHandler = setTimeout(() => {
    try {
      const snap = toJS(store.user)
      Storage.putObject(storageKey, snap);
    } catch (ex) {
      console.log('scheduleWrite2Storage() - user prefs - : ', ex);
    }
  }, 300);
}

// Whenever there's a patch to accounts, just save it
onPatch(store, patch => {
  const {path} = patch;
  if (path.startsWith('/user')) {
    scheduleWrite2Storage();
  }
});

// export created store
export default store;
export {initializeStore};
