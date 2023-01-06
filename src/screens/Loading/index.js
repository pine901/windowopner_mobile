import React from 'react';
import {Button, Center, Column, FormControl, Heading, Image, Link, Row, Spinner, Text} from 'native-base';

import useViewModel from './methods';
import LoginBackground from '@/components/LoginBackground';

const smallLogo = require('@/assets/images/logo-small.png');
const logoTitle = require('@/assets/images/logo-title.png');

const Loading = () => {
  useViewModel();
  return (
    <Column flex={1} justifyContent={'center'}>
      <LoginBackground/>
      <Spinner color={'primary.500'} size={'lg'} />
      <Center
        _text={{
          fontWeight: 'bold',
          fontSize: 'xl',
        }}>
        Loading
      </Center>
    </Column>
  );
};

export default Loading;
