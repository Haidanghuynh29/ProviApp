import React, {PureComponent} from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Indicator from '../common/indicator';

import * as API from '../../apis/api';
import {AppContext} from '../../store/context';

import global from '../style';
import colors from '../../config/colors';
import {vw, vh} from '../../config/dimen';
import {MAIL_CHECK} from '../../config/constant';

export default class App extends PureComponent {
  static contextType = AppContext;

  constructor(props, context) {
    super(props, context);

    this.state = {
      title: '',
      email: context.state.me.email,
      content: '',
      loading: false,
    };
  }

  componentDidMount() {
    const {navigation} = this.props;
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={global.menu} onPress={this.onSubmit}>
          <FontAwesome5 name={'paper-plane'} size={vw(5)} color={'white'} />
        </TouchableOpacity>
      ),
    });
  }

  onSubmit = () => {
    const {title, email, content} = this.state;

    if (!title.length) {
      Alert.alert(`タイトルを${'\n'}入力してください`);
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
    if (!content.length) {
      Alert.alert(`内容を${'\n'}入力してください`);
      return;
    }

    this.setState({loading: true});
    this.api_();
  };

  api_ = async () => {
    const {title, email, content} = this.state;
    await API.add_inquiry(title, email, content);
    this.setState({loading: false}, () => this.props.navigation.goBack());
  };

  render() {
    const {loading, title, email, content} = this.state;

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{paddingBottom: 120}}>
        <Indicator visible={loading} />

        <Text style={styles.txt_description}>お問い合わせのタイトル</Text>
        <TextInput
          style={styles.txt_input}
          value={title}
          onChangeText={(text) => this.setState({title: text})}
        />

        <Text style={styles.txt_description}>メールアドレス</Text>
        <TextInput
          style={styles.txt_input}
          value={email}
          keyboardType="email-address"
          onChangeText={(text) => this.setState({email: text})}
        />

        <Text style={styles.txt_description}>内容</Text>
        <TextInput
          style={[styles.txt_input, styles.multiline]}
          multiline={true}
          value={content}
          onChangeText={(text) => this.setState({content: text})}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: vw(3),
  },
  txt_description: {
    fontSize: 14,
    lineHeight: 25,
    color: colors.text,
  },
  txt_input: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: 'white',
    color: colors.text,
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
  },
  multiline: {
    minHeight: 200,
  },
});
