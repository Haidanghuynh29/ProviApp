import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import MessagesScreen from './messages';
import ChatScreen from './chat';
import ProfileScreen from '../tab_mypage/show';

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
        name="MessagesScreen"
        component={MessagesScreen}
        options={{
          title: 'スカウト/応募状況',
        }}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          title: 'メッセージ',
        }}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title: 'プロフィール詳細',
        }}
      />
    </Stack.Navigator>
  );
}
