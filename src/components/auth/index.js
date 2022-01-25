import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import InitScreen from './init';
import SignInScreen from './sign_in';
import SignUpScreen from './sign_up';
import CertificateScreen from './certificate';
import ProfileEdit from '../tab_mypage/edit';
import IntroductionScreen from '../tab_mypage/introduction';

import {AppContext} from '../../store/context';

import colors from '../../config/colors';

const Stack = createStackNavigator();

export default function App({navigation}) {
  const context = useContext(AppContext);
  const {me} = context.state;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: me.kind ? colors.pink : colors.blue,
        },
        headerTintColor: 'white',
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen
        name="SignInScreen"
        component={SignInScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="InitScreen"
        component={InitScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CertificateScreen"
        component={CertificateScreen}
        options={{
          title: '営業許可証の提出',
        }}
      />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEdit}
        options={{
          title: 'プロフィール登録',
        }}
        initialParams={{mode: 0}}
      />
      <Stack.Screen
        name="IntroductionScreen"
        component={IntroductionScreen}
        options={{
          title: '紹介文の編集',
        }}
      />
    </Stack.Navigator>
  );
}
