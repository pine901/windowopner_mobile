import React from 'react';
import {Button} from 'native-base';

const ActionButton = ({children, onPress, danger, bold, textProps, ...props}) => {
  const buttonColor = React.useMemo(() => {
    return (!!danger)? 'secondary': 'primary';
  }, [danger]);

  const fontWeight = React.useMemo(() => {
    return (bold) ? 700 : 400;
  }, [bold]);
  return (
    <Button
      onPress={onPress}
      colorScheme={buttonColor}
      borderRadius={0}
      _text={{fontWeight, fontSize: 'lg', fontStyle: 'italic', ...textProps}}
      style={{
        shadowColor: '#000000', shadowRadius: 4, shadowOpacity: 0.25, shadowOffset: {width: 0, height: 4}, // iOS
        elevation: 4, // Android
      }}
      {...props}
    >
      {children}
    </Button>
  )
};

export default ActionButton;
