import React, {PureComponent} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {connect} from 'react-redux';
import FastImage from 'react-native-fast-image';

import DialogA from '../common/_dialog';
import DialogB from './_dialog';

import * as API from '../../apis/api';
import {AppContext, SET_POINT, SET_BADGE_CHAT} from '../../store/context';
import {fetchChat} from '../../actions';

import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';
import {BTN_STRS, DLG_STRS} from '../../config/constant';

const colorGroups = [
  [colors.gray, colors.text],
  [colors.brown, colors.text],
  [colors.pink, 'white'],
];

class App extends PureComponent {
  static contextType = AppContext;

  constructor(props, context) {
    super(props, context);

    const {workers, employers} = props.userReducer;
    const {chat} = props;
    const {me} = context.state;
    let user;
    if (me.kind) {
      // worker
      const uid = chat.employer_key;
      user = employers.find((d) => d.key === uid);
    } else {
      // employer
      const uid = chat.worker_key;
      user = workers.find((d) => d.key === uid);
    }

    this.state = {
      dialogKind: null,
      user: user,
    };
  }

  goChat = () => {
    const {chats} = this.props.chatReducer;
    const {chat, navigation} = this.props;
    const {me} = this.context.state;

    if (chat.status > 1) {
      const {badgeIds} = this.context.state;
      var newBadgeIds = badgeIds.slice(0);
      newBadgeIds = newBadgeIds.filter((id) =>
        id !== me.kind ? chat.w_cnt : chat.e_cnt,
      );
      this.context.dispatch({
        type: SET_BADGE_CHAT,
        badgeIds: newBadgeIds,
      });

      if (me.kind) {
        chat.w_cnt = 0;
      } else {
        chat.e_cnt = 0;
      }
      this.props.fetchChat(me.kind, chats, chat);
      navigation.push('ChatScreen', {chat: chat});
    } else {
    }
  };
  goProfile = (user) => () => {
    this.props.navigation.push('ProfileScreen', {user});
  };
  onClick = (label) => () => {
    const index = BTN_STRS.indexOf(label);
    const {chat} = this.props;
    const {point} = this.context.state;

    if (index < 5) {
      this.setState({dialogKind: index});
      // if (chat.status == 1 && index == 2 && point < 1000) {
      //   Alert.alert(
      //     'ポイントがありません',
      //     'ポイント購入へ飛ぶ',
      //     [
      //       {
      //         text: '確認',
      //         onPress: () =>
      //           this.props.navigation.navigate('TabMypage', {
      //             screen: 'PurchageScreen',
      //           }),
      //       },
      //     ],
      //     {cancelable: false},
      //   );
      // } else {
      //   this.context.dispatch({
      //     type: SET_POINT,
      //     point: point - 1000,
      //   });
      //   API.update_point(point - 1000);
      //   this.setState({dialogKind: index});
      // }
    }
  };
  onDlgAClick = (flag) => () => {
    if (flag) {
      const {chat} = this.props;
      const {chats} = this.props.chatReducer;

      chat.status = (this.state.dialogKind % 2) + 2;
      this.props.fetchChat(this.context.state.me.kind, chats, chat);
    }

    this.setState({dialogKind: null});
  };
  onDlgBClick = (kind) => () => {
    if (kind) {
      const {chat} = this.props;
      const {chats} = this.props.chatReducer;
      const {me} = this.context.state;

      chat.status = kind;
      this.props.fetchChat(0, chats, chat);

      const uid = me.kind ? chat.employer_key : chat.worker_key;
      API.fcm_message(uid, me.nickname, kind);
    }
    this.setState({dialogKind: null});
  };

  render() {
    const {chat, mode} = this.props;
    const {me, badgeIds} = this.context.state;
    const {dialogKind, user} = this.state;

    const cntBadge = badgeIds.filter((id) => chat.key).length;
    // const cntBadge = me.kind ? chat.w_cnt : chat.e_cnt;

    return (
      <View style={styles.container}>
        {user != null && (
          <View style={[styles.content, {flex: 1}]}>
            <TouchableOpacity
              style={styles.left}
              onPress={mode > 0 ? null : this.goChat}>
              <FastImage style={styles.icon} source={{uri: user.getUrl()}} />
              {cntBadge !== 0 && (
                <View style={styles.badge}>
                  <Text style={styles.txt_badge}>{cntBadge}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.texts}
              onPress={this.goProfile(user)}>
              <Text style={styles.txt1}>{user.nickname}さん</Text>
              {/* <Text style={styles.txt2}>面接中</Text> */}
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.content}>
          {chat.status == 0 && (
            <>
              <Btn kind={1} text={BTN_STRS[0]} onClick={this.onClick} />
              <Btn kind={0} text={BTN_STRS[1]} onClick={this.onClick} />
            </>
          )}

          {chat.status == 1 && (
            <>
              <Btn kind={1} text={BTN_STRS[2]} onClick={this.onClick} />
              <Btn kind={0} text={BTN_STRS[3]} onClick={this.onClick} />
            </>
          )}

          {chat.status == 2 && (
            <Btn kind={2} text={BTN_STRS[4]} onClick={this.onClick} />
          )}

          {chat.status > 2 && (
            <Btn
              kind={chat.status - 3}
              text={BTN_STRS[chat.status + 2]}
              onClick={this.onClick}
            />
          )}
        </View>

        {chat.status < 3 && (
          <>
            <DialogA
              visible={dialogKind != null && dialogKind < 4}
              text={DLG_STRS[dialogKind]}
              onClick={this.onDlgAClick}
            />
            <DialogB visible={dialogKind == 4} onClick={this.onDlgBClick} />
          </>
        )}
      </View>
    );
  }
}

const Btn = ({kind, text, onClick}) => {
  const colorBk = {backgroundColor: colorGroups[kind][0]};
  const colorTxt = {color: colorGroups[kind][1]};
  return (
    <TouchableOpacity style={[styles.btn, colorBk]} onPress={onClick(text)}>
      <Text style={[styles.btn_txt, colorTxt]}>{text}</Text>
    </TouchableOpacity>
  );
};

function mapStateToProps(state) {
  return {
    userReducer: state.userReducer,
    chatReducer: state.chatReducer,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    fetchChat: (kind, chats, chat, flag) =>
      dispatch(fetchChat(kind, chats, chat, flag)),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(App);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: vh(1),
    marginHorizontal: vw(3),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: vw(15),
    height: vw(15),
    borderRadius: vw(3),
  },
  left: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.pink,
  },
  txt_badge: {
    color: 'white',
  },
  texts: {
    marginLeft: vw(3),
  },
  txt1: {
    fontSize: vw(3.5),
    fontWeight: 'bold',
    color: colors.text,
    lineHeight: vw(4.5),
  },
  txt2: {
    fontSize: vw(3),
    lineHeight: vw(4),
    fontWeight: 'bold',
    color: colors.text,
  },
  btn: {
    width: vw(15),
    height: vw(15),
    borderRadius: vw(2),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: vw(3),
  },
  btn_txt: {
    fontSize: vw(3),
    lineHeight: vw(4),
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
});
