import React from 'react';
import {Column, Input, Text} from 'native-base';

const TitledInput = ({title, textProps, inputProps, ...props}) => {
  return (
    <Column {...props}>
      <Text fontWeight={'700'} fontStyle={'italic'} color={'#8B8B8B'} fontSize={14} {...textProps}>{title}</Text>
      <Input backgroundColor={'#F5F6F9'} borderRadius={0} h={50} fontSize={14} mt={1} {...inputProps}/>
    </Column>
  )
};

export default TitledInput;
