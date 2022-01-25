import React, {PureComponent, useContext, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';

import TabSearch from '../tab_search';
import TabFavorite from '../tab_favorite';
import TabMessage from '../tab_message';
import TabMypage from '../tab_mypage/__drawnav';
// import TabMypage from '../web';

import * as API from '../../apis/api';
import {
  AppContext,
  SET_BADGE_ADMIN,
  SET_BADGE_CHAT,
  SET_BADGE_INQUIRY,
} from '../../store/context';

import colors from '../../config/colors';
import {vw, vh} from '../../config/dimen';

const Tab = createBottomTabNavigator();

export default class App extends PureComponent {
  static contextType = AppContext;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {me} = this.context.state;

    const temp = me.kind ? 'worker_key' : 'employer_key';
    this.badge_chat = firestore()
      .collection(API.CHAT)
      .where(temp, '==', API.current_uid())
      // .where('status', '>', 1)
      .onSnapshot(
        (docSnapshot) => {
          var badgeIds = [];
          docSnapshot.docs.map((doc) => {
            if (me.kind) {
              const ids = new Array(doc.data().w_cnt).fill(doc.id);
              badgeIds = badgeIds.concat(ids);
            } else {
              const ids = new Array(doc.data().e_cnt).fill(doc.id);
              badgeIds = badgeIds.concat(ids);
            }
          });
          this.context.dispatch({
            type: SET_BADGE_CHAT,
            badgeIds,
          });
        },
        (err) => {
          console.log(`Encountered error: ${err}`);
        },
      );

    this.badge_notify = firestore()
      .collection(API.NOTIFICATION)
      .where('toUid', '==', API.current_uid())
      .orderBy('timestamp', 'desc')
      .onSnapshot((docSnapshot) => {
        if (docSnapshot) {
          const docs = docSnapshot.docs;
          if (docs.length) {
            const doc = docs[0];
            const inquiryId = doc.data().inquiryId;
            if (inquiryId && !me.ck_notify_ids.includes(doc.id)) {
              this.context.dispatch({
                type: SET_BADGE_ADMIN,
                badgeAdmin: true,
              });
            }
          }
        }
      });
  }

  componentWillUnmount() {
    this.badge_chat();
    this.badge_notify();
  }

  render() {
    const {me, badgeAdmin, badgeIds} = this.context.state;

    return (
      <Tab.Navigator
        tabBarOptions={{
          inactiveBackgroundColor: '#FFF',
          activeTintColor: me.kind ? colors.pink : colors.blue,
          inactiveTintColor: colors.text,
          labelStyle: {},
          tabStyle: {},
          style: {
            backgroundColor: '#FFF',
          },
          keyboardHidesTabBar: true,
        }}
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            var size = 20;
            if (route.name == 'TabSearch') {
              iconName = 'search';
            } else if (route.name == 'TabFavorite') {
              iconName = 'heart';
            } else if (route.name == 'TabMessage') {
              iconName = 'comment-dots';
            } else {
              iconName = 'home';
            }
            return (
              <FontAwesome5
                name={iconName}
                size={size}
                color={
                  focused ? (me.kind ? colors.pink : colors.blue) : 'lightgray'
                }
              />
            );
          },
        })}>
        <Tab.Screen
          name="TabSearch"
          component={TabSearch}
          options={{
            tabBarLabel: 'さがす',
          }}
        />
        <Tab.Screen
          name="TabFavorite"
          component={TabFavorite}
          options={{
            tabBarLabel: 'お気に入り',
          }}
        />
        <Tab.Screen
          name="TabMessage"
          component={TabMessage}
          options={{
            tabBarLabel: 'メッセージ',
            tabBarBadge: badgeIds.length ? badgeIds.length : null,
          }}
        />
        <Tab.Screen
          name="TabMypage"
          component={TabMypage}
          options={{
            tabBarLabel: 'マイページ',
            tabBarBadge: badgeAdmin,
          }}
        />
      </Tab.Navigator>
    );
  }
}
