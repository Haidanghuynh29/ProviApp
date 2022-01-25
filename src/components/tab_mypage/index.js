import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import MypageScreen from './mypage';
import ProfileShowScreen from './show';
import BlockScreen from '../tab_search/profiles';
import ProfileScreen from './show';
import ProfileEditScreen from './edit';
import IntroductionScreen from './introduction';
import PurchageScreen from './purchage';
import InquiryScreen from './inquiry';
import NotificationScreen from './notification';
import NotificationDetailScreen from './notification_detail';
import UpdateEmailScreen from './update_email';
import UpdatePasswordScreen from './update_password';
import InviteScreen from './invite';
import Menu from '../common/_menu';

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
        name="MypageScreen"
        component={MypageScreen}
        options={{
          title: 'マイページ',
          headerRight: () => {
            return <Menu navigation={navigation} />;
          },
        }}
      />
      <Stack.Screen
        name="ProfileShowScreen"
        component={ProfileShowScreen}
        options={{
          title: 'プロフィール',
        }}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          title: 'プロフィール詳細',
        }}
      />
      <Stack.Screen
        name="ProfileEditScreen"
        component={ProfileEditScreen}
        options={{
          title: 'プロフィール編集',
        }}
        initialParams={{mode: 1}}
      />
      <Stack.Screen
        name="BlockScreen"
        component={BlockScreen}
        options={{
          title: 'ブロックリスト',
        }}
        initialParams={{mode: 1}}
      />
      <Stack.Screen
        name="IntroductionScreen"
        component={IntroductionScreen}
        options={{
          title: '紹介文の編集',
        }}
      />
      <Stack.Screen
        name="PurchageScreen"
        component={PurchageScreen}
        options={{
          title: 'ポイント購入',
        }}
      />
      <Stack.Screen
        name="InquiryScreen"
        component={InquiryScreen}
        options={{
          title: 'お問い合わせ',
        }}
      />
      <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{
          title: '通知一覧',
        }}
      />
      <Stack.Screen
        name="NotificationDetailScreen"
        component={NotificationDetailScreen}
        options={{
          title: '通知詳細',
        }}
      />
      <Stack.Screen
        name="UpdatePasswordScreen"
        component={UpdatePasswordScreen}
        options={{
          title: 'パスワード変更',
        }}
      />
      <Stack.Screen
        name="UpdateEmailScreen"
        component={UpdateEmailScreen}
        options={{
          title: 'メールアド変更',
        }}
      />
      <Stack.Screen
        name="InviteScreen"
        component={InviteScreen}
        options={{
          title: '招待コード',
        }}
      />
    </Stack.Navigator>
  );
}
