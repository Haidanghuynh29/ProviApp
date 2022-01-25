import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import Share from 'react-native-share';

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
      loading: true,
      code: '',
      expired: false,
      inviteId: null,
    };
  }

  async UNSAFE_componentWillMount() {
    this.api_get_code();
  }

  api_get_code = async () => {
    const invite = await API.get_my_code();
    if (invite) {
      this.setState({
        code: invite.code,
        expired: invite.expired,
        inviteId: invite.id,
        loading: false,
      });
    } else {
      this.setState({loading: false});
    }
  };

  openShare = () => {
    const {code} = this.state;
    const options = {
      title: 'プロビー',
      message: code,
      url: 'http://provi-jp.com',
    };
    Share.open(options)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  alert = (str) => {
    this.setState({loading: false}, () =>
      setTimeout(() => Alert.alert(str), 500),
    );
  };

  onSubmit = async () => {
    this.setState({loading: true});
    await API.create_invite(this.state.inviteId);
    this.api_get_code();
  };

  render() {
    const {loading, code, expired} = this.state;

    return (
      <View style={styles.container}>
        <Indicator visible={loading} />

        <View style={styles.box}>
          <Text style={styles.label}>招待コード</Text>
          <Text style={expired ? styles.expired : styles.able}>{code}</Text>
        </View>

        <TouchableOpacity style={styles.btn} onPress={this.onSubmit}>
          <Text style={styles.txt_btn}>
            {code ? '招待再発行' : '招待コード発行'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, {backgroundColor: colors.blue}]}
          onPress={this.openShare}>
          <Text style={styles.txt_btn}>シェア</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const value = {
  flex: 1,
  fontSize: 28,
  fontWeight: 'bold',
  textAlign: 'center',
  backgroundColor: 'lightgray',
  marginHorizontal: 16,
  lineHeight: 50,
  height: 50,
  borderRadius: 8,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vh(3),
  },
  label: {
    color: colors.darkgray,
  },
  expired: {
    ...value,
    color: colors.gray,
  },
  able: {
    ...value,
    color: colors.blue,
  },
  btn: {
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: colors.brown,
    marginTop: vh(2.5),
  },
  txt_btn: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
});
