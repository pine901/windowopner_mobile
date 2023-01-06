import React from 'react';
import {observer} from 'mobx-react';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {Collapse, Column, Icon, Image, Row, Text, View} from 'native-base';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import {Screens} from '@/constants/Navigation';
import ActionButton from '@/components/buttons/ActionButton';
import {resetWithScreen} from '@/services/navigation';
import {confirmAlert} from '@/utils/alert';
import {useStore} from '@/hooks';

const ProfileMain = () => {
  const nav = useNavigation();
  const store = useStore();

  const onPressLogOut = async () => {
    const answer = await confirmAlert('Are you sure you want to log out?');
    if (!answer) {
      return;
    }
    store.user.logOut();
    resetWithScreen(nav, Screens.login);
  }
  return (
    <Column p={4} space={2} flex={1}>
      <MenuItem icon={'unlock'} title={'Change Password'} onPress={() => {nav.navigate(Screens.changePassword)}}/>
      <MenuItem icon={'settings'} title={'Settings'} onPress={() => {nav.navigate(Screens.settings)}}/>
      <View flex={1}/>
      <ActionButton danger onPress={onPressLogOut}>LOGOUT</ActionButton>
    </Column>
  )
};

const MenuItem = ({icon, title, onPress}) => {
  return (
    <MenuItemContainer onPress={onPress}>
      <Row alignItems={'center'} mx={4} flex={1}>
        <Icon as={Feather} name={icon} size={'md'} color={'grey'} mr={4}/>
        <Text flex={1} fontSize={17}>{title}</Text>
        <Icon as={Feather} name={'arrow-right'} size={'md'} color={'grey'}/>
      </Row>
    </MenuItemContainer>
  )
}

const MenuItemContainer = styled.TouchableOpacity`
  background-color: white;
  height: 51px;
`

export default observer(ProfileMain);