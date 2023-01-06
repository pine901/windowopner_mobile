import {types} from 'mobx-state-tree';
import {AppName} from '@/constants';

export const Types = {
  info: 'info',
  success: 'success',
  warn: 'warn',
  error: 'error',
};

const Notification = types
  .model('Notification', {
    title: '',
    message: '',
    type: '',
    visible: false,
    flag: 0, // Increases
  })
  .actions(self => {
    const show = (type, message, title) => {
      self.type = type;
      self.message = message || '';
      self.title = title || AppName;
      self.visible = true;
      self.flag = self.flag + 1;
    };
    const hide = () => {
      self.visible = false;
    };
    const showError = (message, title) => {
      show(Types.error, message, title);
    };
    const showInfo = (message, title) => {
      show(Types.info, message, title);
    };
    const showWarn = (message, title) => {
      show(Types.warn, message, title);
    };
    const showSuccess = (message, title) => {
      show(Types.success, message, title);
    };

    return {show, hide, showError, showInfo, showWarn, showSuccess};
  });

export default Notification;
