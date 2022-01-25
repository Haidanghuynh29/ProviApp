import React, {PureComponent} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import TabMessages from './_messages';

import {AppContext} from '../../store/context';

import colors from '../../config/colors';
import {vw, vh} from '../../config/dimen';

const Tab = createMaterialTopTabNavigator();

export default class App extends PureComponent {
  static contextType = AppContext;

  constructor(props) {
    super(props);
  }

  render() {
    const strings = this.context.state.me.kind
      ? ['面接依頼中', '面接終了']
      : ['スカウト中', '面接終了'];

    return (
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: colors.blue,
          inactiveTintColor: '#424242',
          scrollEnabled: true,
          tabStyle: {
            width: vw(50),
          },
          indicatorStyle: {
            height: 2,
            backgroundColor: colors.blue,
          },
          labelStyle: {
            fontSize: 16,
          },
        }}
        swipeEnabled={true}>
        <Tab.Screen
          name="TabMessagesA"
          component={TabMessages}
          options={{tabBarLabel: strings[0]}}
          initialParams={{mode: 0}}
        />
        <Tab.Screen
          name="TabMessagesB"
          component={TabMessages}
          options={{tabBarLabel: strings[1]}}
          initialParams={{mode: 1}}
        />
      </Tab.Navigator>
    );
  }
}
