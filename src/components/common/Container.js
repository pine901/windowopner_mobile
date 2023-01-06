import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
`;

const SafeContainer = styled(SafeAreaView)`
  flex: 1;
`;

export default Container;

export {SafeContainer};
