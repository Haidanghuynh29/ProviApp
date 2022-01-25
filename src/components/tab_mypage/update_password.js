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

export default class App extends PureComponent {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      password: '',
      newPassword: '',
      confirmPassword: '',
    };
  }

  alert = (str) => {
    this.setState({loading: false}, () =>
      setTimeout(() => Alert.alert(str), 500),
    );
  };

  onSubmit = () => {
    const {password, newPassword, confirmPassword} = this.state;
    const {me} = this.context.state;

    this.setState({loading: true});

    API.sign_in_email(me.email, password)
      .then((result) => {
        if (newPassword.length < 8) {
          this.alert(`８文字以上のパスワードを${'\n'}入力してください`);
          return;
        }
        if (newPassword !== confirmPassword) {
          this.alert('パスワードが一致しません');
          return;
        }

        API.current_user().updatePassword(newPassword);
        this.alert('パスワードを変更しました');
      })
      .catch((_) => {
        this.alert('パスワードが間違っています');
      });
  };

  componentDidMount() {
    const {navigation} = this.props;

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={this.onSubmit}>
          <Text style={styles.txt}>保存</Text>
        </TouchableOpacity>
      ),
    });
  }

  render() {
    const {loading, password, newPassword, confirmPassword} = this.state;

    return (
      <View style={styles.container}>
        <Indicator visible={loading} />

        <TextInput
          style={[styles.txt_input, {marginBottom: vh(3)}]}
          value={password}
          secureTextEntry={true}
          placeholder="パスワード"
          placeholderTextColor="lightgray"
          autoCapitalize="none"
          onChangeText={(text) => this.setState({password: text})}
        />
        <TextInput
          style={styles.txt_input}
          value={newPassword}
          secureTextEntry={true}
          placeholder="新しいパスワード"
          placeholderTextColor="lightgray"
          autoCapitalize="none"
          onChangeText={(text) => this.setState({newPassword: text})}
        />
        <TextInput
          style={styles.txt_input}
          value={confirmPassword}
          secureTextEntry={true}
          placeholder="パスワード確認"
          placeholderTextColor="lightgray"
          autoCapitalize="none"
          onChangeText={(text) => this.setState({confirmPassword: text})}
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
