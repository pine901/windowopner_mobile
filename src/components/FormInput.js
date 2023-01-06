import React from 'react';
import {Input} from 'native-base';

const FormInput = (props) => {
  return (
    <Input borderRadius={0} backgroundColor={'#F5F6F9'} {...props}/>
  );
};

export default FormInput;