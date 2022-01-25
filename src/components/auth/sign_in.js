import React, {PureComponent} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
} from 'react-native';

import FastImage from 'react-native-fast-image';

import Indicator from '../common/indicator';
import HeaderC from './_header';

import * as API from '../../apis/api';
import {AppContext, SET_PROFILE} from '../../store/context';

import styles from './style';
import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';
import {MAIL_CHECK} from '../../config/constant';
import User from '../../models/user';

const IMG_BK = require('../../../assets/images/bk_logo.jpg');

export default class App extends PureComponent {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      loading: false,
    };
  }

  componentDidMount() {
    if (this.context.state.me.key) {
      this.props.navigation.push('ProfileEdit');
    }
  }

  goScreen = () => {
    this.props.navigation.push('InitScreen');
  };

  onSubmit = () => {
    const {email, password} = this.state;

    if (!email.length) {
      Alert.alert(`メールアドレスを${'\n'}入力してください`);
      return;
    }
    if (!MAIL_CHECK.test(String(email).toLowerCase())) {
      Alert.alert(`メールアドレスが${'\n'}正確ではありません`);
      return;
    }
    if (password.length < 8) {
      Alert.alert(`８文字以上のパスワードを${'\n'}入力してください`);
      return;
    }

    this.setState({loading: true});
    API.sign_in_email(email, password)
      .then((result) => this.onResult(result.user.uid))
      .catch((_) => this.onResult(null));
  };
  onResult = async (uid) => {
    if (uid) {
      const auth = API.current_user();
      const me = await API.get_profile(uid);
      let condition = auth.emailVerified;
      if (me) {
        if (me.blocked) {
          this.setState({loading: false}, () =>
            setTimeout(() => {
              Alert.alert('', 'アカウント利用が許可されていません。');
              API.sign_out();
            }, 500),
          );
          return;
        }
        if (me.kind == 0) {
          condition = true;
        }
      }
      if (condition) {
        const me = await API.get_profile(uid);
        this.setState({loading: false});

        if (me) {
          this.context.dispatch({
            type: SET_PROFILE,
            me: me,
            point: me.point,
          });

          if (me.email !== auth.email) {
            me.email = auth.email;
            API.update_user_field({email: auth.email});
          }

          if (!me.updated_at) {
            this.props.navigation.push('ProfileEdit');
          }
        } else {
          const info = {
            kind: auth.displayName === '1' ? 1 : 0,
            email: auth.email,
            visible: true,
            blocked: false,
            unit: 1,
            created_at: new Date().getTime(),
          };
          const user = new User(info, auth.uid);

          this.context.dispatch({type: SET_PROFILE, me: user});
          API.add_user(user);
          setTimeout(() => {
            this.props.navigation.push('ProfileEdit');
          }, 1000);
        }
      } else {
        this.setState({loading: false}, () =>
          setTimeout(() => {
            Alert.alert('メール認証をして下さい');
            API.sign_out();
          }, 500),
        );
      }
    } else {
      this.setState({loading: false}, () =>
        setTimeout(() => Alert.alert('ログイン失敗しました。'), 500),
      );
    }
  };

  render() {
    const {email, password, loading} = this.state;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
          <FastImage source={IMG_BK} style={styles.container}>
            <Indicator visible={loading} />

            <HeaderC />

            <View style={styles.content}>
              <TextInput
                style={styles.txt_input}
                value={email}
                keyboardType="email-address"
                placeholder="メールアドレス"
                placeholderTextColor="white"
                autoCapitalize="none"
                onChangeText={(text) => this.setState({email: text})}
              />
              <TextInput
                style={styles.txt_input}
                value={password}
                placeholder="パスワード"
                placeholderTextColor="white"
                onChangeText={(text) => this.setState({password: text})}
                secureTextEntry={true}
              />
              <TouchableOpacity style={styles.btn} onPress={this.onSubmit}>
                <Text style={styles.txt_btn}>ログイン</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginTop: vh(3)}}
                onPress={this.goScreen}>
                <Text style={styles.txt_btn}>新規会員登録</Text>
              </TouchableOpacity>
            </View>
          </FastImage>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}
