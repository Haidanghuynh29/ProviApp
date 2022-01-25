import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import ProfilesScreen from './profiles';
import ProfileScreen from './profile';

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
        name="ProfilesScreen"
        component={ProfilesScreen}
        options={{title: 'さがす'}}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{title: 'プロフィール詳細'}}
      />
    </Stack.Navigator>
  );
}
