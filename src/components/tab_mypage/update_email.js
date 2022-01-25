import React, {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

import Indicator from '../common/indicator';

import * as API from '../../apis/api';
import {AppContext} from '../../store/context';

import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';
import {MAIL_CHECK} from '../../config/constant';

export default class App extends PureComponent {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      email: '',
      newEmail: '',
    };
  }

  alert = (title, contents = '') => {
    this.setState({loading: false}, () =>
      setTimeout(() => Alert.alert(title, contents), 500),
    );
  };

  onSubmit = () => {
    const {email, newEmail} = this.state;
    // const {me} = this.context.state;

    if (!MAIL_CHECK.test(email) || !MAIL_CHECK.test(email)) {
      Alert.alert(`メールアドレスが${'\n'}正確ではありません`);
      return;
    }

    this.setState({loading: true});
    API.current_user()
      .verifyBeforeUpdateEmail(newEmail)
      .then((_) => {
        this.alert('メール認証後、再度ログインしてください');
      })
      .catch((error) => {
        if (error.code === 'auth/requires-recent-login') {
          this.alert(
            '',
            'この操作は機密性が高く、最新の認証が必要です。 この要求を再試行する前に、再度ログインしてください。',
          );
        } else {
          this.alert('メール変更に失敗しました');
        }
      });
  };

  componentDidMount() {
    const {navigation} = this.props;

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={this.onSubmit}>
          <Text style={styles.txt}>変更する</Text>
        </TouchableOpacity>
      ),
    });
  }

  render() {
    const {loading, email, newEmail} = this.state;

    return (
      <View style={styles.container}>
        <Indicator visible={loading} />

        <TextInput
          style={[styles.txt_input, {marginBottom: vh(3)}]}
          value={email}
          keyboardType="email-address"
          placeholder="メールアドレス"
          placeholderTextColor="lightgray"
          autoCapitalize="none"
          onChangeText={(text) => this.setState({email: text})}
        />
        <TextInput
          style={styles.txt_input}
          value={newEmail}
          keyboardType="email-address"
          placeholder="新しいメールアドレス"
          placeholderTextColor="lightgray"
          autoCapitalize="none"
          onChangeText={(text) => this.setState({newEmail: text})}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  txt: {
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 16,
  },
  txt_input: {
    // fontSize: vw(4.5),
    color: colors.text,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginBottom: vh(1),
  },
});
