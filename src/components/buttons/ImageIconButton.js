import React from 'react';
import {IconButton as IconButtonNB, Image} from 'native-base';

const ImageIconButton = ({icon, ...props}) => {
  return <IconButtonNB icon={<Image source={icon} />} {...props} />;
};

export default ImageIconButton;
