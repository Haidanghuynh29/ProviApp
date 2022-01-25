import React, {PureComponent} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import FastImage from 'react-native-fast-image';

import Indicator from '../common/indicator';
import Header from './_header';

import * as API from '../../apis/api';
import {AppContext, SET_PROFILE} from '../../store/context';

import styles from './style';
import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';
import {MAIL_CHECK} from '../../config/constant';

const IMG_BK = require('../../../assets/images/bk_logo.jpg');

export default class App extends PureComponent {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    const {kind} = props.route.params;
    this.state = {
      kind: kind,
      code: '',
      email: '',
      password: '',
      passwordConfirm: '',
      loading: false,
    };
  }

  onSubmit = async () => {
    const {kind, code, email, password, passwordConfirm} = this.state;
    if (!kind && !code.length) {
      Alert.alert(`招待コードを${'\n'}入力してください`);
      return;
    }
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
    if (password !== passwordConfirm) {
      Alert.alert('パスワードが一致しません。');
      return;
    }

    if (!kind) {
      const isAvailable = await API.check_invite_code(code);
      if (!isAvailable) {
        Alert.alert(`招待コードが${'\n'}正しくありません`);
        return;
      }
    }

    this.setState({loading: true});
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.onResult(result.user);
      })
      .catch((err) => {
        console.log(err);
        this.onResult(null);
      });
  };

  onResult = async (user) => {
    const {kind} = this.state;

    if (user) {
      API.current_user().updateProfile({displayName: kind.toString()});

      if (kind == 1) {
        // worker
        API.send_mail_verify()
          .then((_) => {
            this.setState({loading: false}, () =>
              setTimeout(() => {
                Alert.alert(
                  'アカウント登録',
                  'メール確認後、ログインしてください。',
                  [
                    {
                      text: '確認',
                      style: 'cancel',
                      onPress: () => {
                        this.props.navigation.navigate('SignInScreen');
                      },
                    },
                    {
                      text: 'キャンセル',
                    },
                  ],
                  {cancelable: false},
                );
              }, 500),
            );
          })
          .catch((error) => {
            console.log(error);
            this.setState({loading: false}, () =>
              setTimeout(
                () => Alert.alert('認証メール送信に失敗しました。'),
                500,
              ),
            );
          });
      } else {
        // employer
        this.setState({loading: false});
        this.props.navigation.push('CertificateScreen');
      }

      // const me = {
      //   kind: kind,
      //   key: user.uid,
      //   email: user.email,
      //   visible: true,
      //   blocked: false,
      //   unit: 1,
      //   created_at: new Date().getTime(),
      // };
      // await API.add_user(me);
      // this.context.dispatch({
      //   type: SET_PROFILE,
      //   me: me,
      //   point: me.point,
      // });
      // this.setState({loading: false});
      // this.props.navigation.push('ProfileEdit');
    } else {
      this.setState({loading: false}, () =>
        setTimeout(() => Alert.alert('登録失敗しました。'), 500),
      );
    }
  };

  render() {
    const {kind, code, email, password, passwordConfirm, loading} = this.state;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <FastImage source={IMG_BK} style={styles.container}>
          <Indicator visible={loading} />
          <Header />

          <View style={styles.content}>
            {!kind && (
              <TextInput
                style={styles.txt_input}
                value={code}
                placeholder="招待コード"
                placeholderTextColor="white"
                onChangeText={(text) => this.setState({code: text})}
              />
            )}
            <TextInput
              style={styles.txt_input}
              value={email}
              keyboardType="email-address"
              placeholder="メールアドレス"
              placeholderTextColor="white"
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
            <TextInput
              style={styles.txt_input}
              value={passwordConfirm}
              placeholder="パスワード確認"
              placeholderTextColor="white"
              onChangeText={(text) => this.setState({passwordConfirm: text})}
              secureTextEntry={true}
            />
            <TouchableOpacity style={styles.btn} onPress={this.onSubmit}>
              <Text style={styles.txt_btn}>登録</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginTop: vh(3)}}
              onPress={this.props.navigation.goBack}>
              <Text style={styles.txt_btn}>戻る</Text>
            </TouchableOpacity>
          </View>
        </FastImage>
      </TouchableWithoutFeedback>
    );
  }
}
