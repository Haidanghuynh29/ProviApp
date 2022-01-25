import React, {PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import TextBox from '../common/_txt_box';
import BtnBuy from '../common/_btn_buy';
import Indicator from '../common/indicator.js';

import * as API from '../../apis/api';
import {AppContext, SET_PROFILE} from '../../store/context';

import global from '../style';
import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';
import * as Helper from '../../config/helper';

export default class App extends PureComponent {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      cnt_scout: null,
      cnt_interview: null,
      cnt_cancel: null,
      cnt_follower: null,
      loading: false,
    };
  }

  componentDidMount() {
    this.api_status();
  }

  api_status = async () => {
    const user = this.context.state.me;
    const chats = await API.get_chats(user.kind, user.key);
    const followers = await API.get_follower_user_ids(user.key);

    const cnt_scout = chats.length;
    const cnt_interview = chats.filter((d) => d.status >= 2).length;
    const cnt_cancel = chats.filter((d) => d.status == 3).length;
    const cnt_follower = followers.length;
    this.setState({
      cnt_scout,
      cnt_interview,
      cnt_cancel,
      cnt_follower,
    });
  };

  goScreen = (kind) => () => {
    this.props.navigation.push('ProfileShowScreen');
  };

  onExit = () => {
    Alert.alert('', '本当に脱退しましょうか？', [
      {
        text: 'キャンセル',
      },
      {
        text: '脱退',
        onPress: () => {
          this.setState({loading: true});
          this.apiDelete();
        },
      },
    ]);
  };
  apiDelete = async () => {
    await API.delete_user();
    this.context.dispatch({type: SET_PROFILE});
    this.setState({loading: false});
  };

  render() {
    const {me, point} = this.context.state;
    const {cnt_scout, cnt_interview, cnt_cancel, cnt_follower, loading} =
      this.state;

    return (
      <ScrollView style={styles.container}>
        <Indicator visible={loading} />

        <FastImage style={styles.img_user} source={{uri: me.getUrl()}} />

        <Text style={styles.txt} onPress={this.goScreen(1)}>
          プロフィール
        </Text>

        {!me.kind && (
          <>
            <BtnBuy text="ポイント購入" navigation={this.props.navigation} />
            <TextBox
              txtA="残りポイント"
              txtB={Helper.number_delimiter(parseInt(point))}
            />
          </>
        )}

        <TextBox txtA="総スカウト件数" txtB={cnt_scout} />
        <TextBox txtA="面接実績" txtB={cnt_interview} />
        {me.kind !== 0 && <TextBox txtA="面接キャンセル" txtB={cnt_cancel} />}
        <TextBox txtA="いいね数" txtB={cnt_follower} />

        {/* <TouchableOpacity style={styles.btn} onPress={this.onExit}>
          <Text style={styles.txt_btn}>アカウント脱退</Text>
        </TouchableOpacity> */}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: vh(3),
    paddingHorizontal: vw(3),
  },
  img_user: {
    alignSelf: 'center',
    width: vw(55),
    height: undefined,
    aspectRatio: 1 / 1,
    borderRadius: vw(2),
    borderWidth: 2,
    borderColor: 'white',
  },
  txt: {
    fontSize: vw(4),
    color: colors.blue,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: vh(1.5),
  },
  btn: {
    flex: 1,
    marginTop: 16,
    backgroundColor: colors.gray,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
  },
  txt_btn: {
    textAlign: 'center',
    color: colors.darkgray,
    fontSize: 15,
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    right: vw(2.5),
    top: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.red,
  },
});
