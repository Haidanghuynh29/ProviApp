import React, {PureComponent} from 'react';
import {Alert} from 'react-native';

import {Platform} from 'react-native';
import {connect} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import {createStackNavigator} from '@react-navigation/stack';

import AuthStack from './auth';
import TabStack from './tab';
import WebStack from './web';

import * as API from '../apis/api';
import Firebase from '../apis/firebase';
import {AppContext, SET_PROFILE} from '../store/context';
import {
  fetchWorker,
  fetchEmployer,
  fetchFavIds,
  fetchChat,
  fetchBlockingIds,
  fetchBlockedIds,
} from '../actions';

const Stack = createStackNavigator();

class App extends PureComponent {
  static contextType = AppContext;

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    if (API.current_uid()) {
      const me = await API.get_profile();

      if (me) {
        if (me.blocked) {
          Alert.alert('', 'アカウント利用が許可されていません。');
          this.context.dispatch({
            type: SET_PROFILE,
          });
          API.sign_out();
          return;
        }

        const auth = API.current_user();

        if (me.kind) {
          if (auth.emailVerified) {
            if (me.email !== auth.email) {
              me.email = auth.email;
              API.update_user_field({email: auth.email});
            }
          }
        } else {
        }

        this.context.dispatch({
          type: SET_PROFILE,
          me: me,
          point: me.point,
        });

        Firebase.checkPermission();
      } else {
        API.sign_out();
      }
    }

    SplashScreen.hide();
  }

  render() {
    const {me} = this.context.state;
    // console.log(me)

    return (
      <Stack.Navigator headerMode="none" screenOptions={{}}>
        {me.updated_at ? (
          <Stack.Screen name="TabStack" component={TabStack} />
        ) : (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        )}
      </Stack.Navigator>
    );
  }
}

function mapStateToProps(state) {
  return {};
}
function mapDispatchToProps(dispatch) {
  return {
    fetchWorker: () => dispatch(fetchWorker()),
    fetchEmployer: () => dispatch(fetchEmployer()),
    fetchFavIds: () => dispatch(fetchFavIds()),
    fetchBlockingIds: () => dispatch(fetchBlockingIds()),
    fetchBlockedIds: () => dispatch(fetchBlockedIds()),
    fetchChat: (kind) => dispatch(fetchChat(kind)),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
