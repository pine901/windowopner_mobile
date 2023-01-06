import {types} from 'mobx-state-tree';
import Notification from './Notification';
import Hud from './Hud';
import User from './User';
import {defInt} from './Types';

const Store = types
  .model({
    notification: Notification,
    hud: Hud,
    isInitialized: false,
    user: User,
    unauthorizedFlag: defInt,
    bleDevices: types.map(types.frozen())
  })
  .actions(self => ({
    setInitialized: () => {
      self.isInitialized = true;
    },
    setUnAuthorized: () => {
      // increase unauthorized flag
      self.unauthorizedFlag = self.unauthorizedFlag + 1;
    },
    setBLEPeripheral: (id, value) => {
      self.bleDevices.set(id, value);
    },
    clearBLEPeripherals: () => {
      self.bleDevices.replace({});
    }
  }))
export default Store;
