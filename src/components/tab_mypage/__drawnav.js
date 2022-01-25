import React, {useContext} from 'react';
import {Linking, Alert} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import auth from '@react-native-firebase/auth';

import MypageStack from './index';

import * as API from '../../apis/api';
import {AppContext, SET_PROFILE} from '../../store/context';

import {URL_PRIVACY} from '../../config/constant';

const Drawer = createDrawerNavigator();

export default function App({navigation}) {
  return (
    <Drawer.Navigator
      drawerPosition="right"
      drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="MypageStack"
        options={{
          title: 'マイページ',
        }}
        component={MypageStack}
      />
    </Drawer.Navigator>
  );
}

function CustomDrawerContent(props) {
  const context = useContext(AppContext);
  const {me} = context.state;

  const goDraw = (index) => async () => {
    switch (index) {
      case 1:
        props.navigation.push('InquiryScreen');
        break;
      case 2:
        // const url = API.get_configs('privacy_policy');

        Linking.canOpenURL(URL_PRIVACY).then((supported) => {
          if (supported) {
            Linking.openURL(URL_PRIVACY);
          }
        });
        break;
      case 3:
        props.navigation.push('BlockScreen');
        break;
      case 4:
        props.navigation.push('NotificationScreen');
        break;
      case 5:
        props.navigation.push('UpdatePasswordScreen');
        break;
      case 6:
        props.navigation.push('UpdateEmailScreen');
        break;
      case 7:
        props.navigation.push('InviteScreen');
        break;
      case 8:
        Alert.alert('', '本当に脱退しましょうか？', [
          {
            text: 'キャンセル',
          },
          {
            text: '脱退',
            onPress: async () => {
              await API.delete_user();
              context.dispatch({type: SET_PROFILE, me: null});
            },
          },
        ]);
        break;
      case 0:
        await auth().signOut();
        context.dispatch({type: SET_PROFILE, me: null});
        break;
      default:
        props.navigation.push('EventsScreen', {mode: index - 1});
        break;
    }
    props.navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="通知一覧" onPress={goDraw(4)} />
      {me.kind === 0 && <DrawerItem label="招待コード" onPress={goDraw(7)} />}
      <DrawerItem label="ブロックリスト" onPress={goDraw(3)} />
      <DrawerItem label="パスワード変更" onPress={goDraw(5)} />
      <DrawerItem label="メールアドレス変更" onPress={goDraw(6)} />
      <DrawerItem label="お問い合わせ" onPress={goDraw(1)} />
      <DrawerItem label="プライバシーポリシー" onPress={goDraw(2)} />
      <DrawerItem label="アカウント脱退" onPress={goDraw(8)} />
      <DrawerItem label="ログアウト" onPress={goDraw(0)} />
    </DrawerContentScrollView>
  );
}
