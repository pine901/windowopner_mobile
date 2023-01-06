import React from 'react';
import {Row, Column, Image} from 'native-base';

const topEllipse = require('@/assets/images/bg-top-ellipse.png');
const bottomEllipse = require('@/assets/images/bg-bottom-ellipse.png');

const LoginBackground = () => {
  return (
    <Column backgroundColor={'white'}
            position={'absolute'} left={0} top={0} bottom={0} right={0}
            justifyContent={'space-between'}>
      <Column alignSelf={'flex-end'}>
        <Image source={topEllipse}/>
      </Column>
      <Column alignSelf={'flex-start'}>
        <Image source={bottomEllipse}/>
      </Column>
    </Column>
  )
};

export default LoginBackground;
