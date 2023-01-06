import React, {useRef, useEffect} from 'react';
import {useStore} from '@/hooks';
import DropdownAlert from 'react-native-dropdownalert';
import {FontSizes} from '@/styles/Sizes';
import {observer} from 'mobx-react';

const baseStyle = {
  textAlign: 'left',
  fontWeight: 'bold',
  color: 'white',
  backgroundColor: 'transparent',
};

const titleStyle = {...baseStyle, fontSize: FontSizes.dropAlertTitle};
const messageStyle = {...baseStyle, fontSize: FontSizes.dropAlertMessage};

const Alert = props => {
  const {notification: alert} = useStore();
  const ref = useRef();

  // Subscribe to alert changes
  useEffect(() => {
    if (alert.visible) {
      ref.current.closeAction();
      ref.current.alertWithType(alert.type, alert.title, alert.message);
    }
  }, [alert.title, alert.message, alert.visible, alert.type, alert.flag]);

  return (
    <DropdownAlert
      ref={node => (ref.current = node)}
      titleNumOfLines={0}
      messageNumOfLines={0}
      titleStyle={titleStyle}
      messagesStyle={messageStyle}
      successColor="#000"
      updateStatusBar={false}
      onClose={alert.hide}
    />
  );
};

export default observer(Alert);
