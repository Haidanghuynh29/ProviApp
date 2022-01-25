import React, {PureComponent} from 'react';
import {StyleSheet, View} from 'react-native';
import 'dayjs/locale/ja';
import {connect} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {GiftedChat, Send} from 'react-native-gifted-chat';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import * as API from '../../apis/api';
import {AppContext} from '../../store/context';
import {fetchWorker, fetchEmployer} from '../../actions';

import global from '../style';
import colors from '../../config/colors';
import {vw, vh} from '../../config/dimen';

class App extends PureComponent {
  static contextType = AppContext;

  constructor(props, context) {
    super(props, context);

    const {chat} = props.route.params;
    this.state = {
      loading: true,
      chat: chat,
      messages: [],
    };

    this.onSend = this.onSend.bind(this);
  }

  componentDidMount() {
    this.init();
    // const {messages} = this.state
    // const {user} = this.context.state
    // this.snapshot = firestore().collection(API.EVENT).doc(this.state.event_id)
    //   .collection(API.COMMENT).orderBy('createdAt', 'desc').onSnapshot(
    //   {includeMetadataChanges: true },
    //   (querySnapshot) => {
    //     if (querySnapshot.size != 0 && messages.length) {
    //       const newMsg = new Comment(querySnapshot.docs[0])
    //       const lastMsg = messages[messages.length - 1]

    //       if (lastMsg.text != newMsg.text && newMsg.user._id != user.key) {
    //         const newMsgs = [...messages, newMsg]
    //         this.setState({messages: newMsgs})
    //       }
    //     }
    //   },
    //   (error) => console.error("error"), // onError
    // )
  }
  componentWillUnmount() {
    // this.snapshot()
  }
  init = async () => {
    const messages = await API.get_messages(this.state.chat.key);
    this.setState({messages, loading: false});

    const {me} = this.context.state;
    const {chat} = this.state;
    API.reset_badge(chat.key, me.kind);
  };
  onSend(msgs) {
    const {me} = this.context.state;
    const {chat, messages} = this.state;

    this.setState({messages: GiftedChat.append(messages, msgs)});

    API.create_message(chat.key, msgs[0], me.kind);
    const uid = me.kind ? chat.employer_key : chat.worker_key;
    API.fcm_message(uid, me.nickname, 2);
  }

  render() {
    const {messages} = this.state;
    const {me} = this.context.state;

    const userObj = {
      _id: me.key,
      avatar: me.getUrl(),
      name: me.nickname,
    };

    return (
      <GiftedChat
        style={{flex: 1}}
        locale="ja"
        placeholder="メッセージを入力。。。"
        keyboardShouldPersistTaps="never"
        renderUsernameOnMessage={true}
        renderAvatarOnTop={true}
        messages={messages}
        onSend={(msgs) => this.onSend(msgs)}
        user={userObj}
        renderSend={(props) => (
          <Send {...props} containerStyle={styles.send}>
            <FontAwesome5
              name={'paper-plane'}
              size={vw(5)}
              color={colors.blue}
            />
          </Send>
        )}
        onPressAvatar={(user) => {
          // navigation.push("ProfileScreen", {
          //   user_id: user._id
          // })
        }}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    userReducer: state.userReducer,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    fetchWorker: () => dispatch(fetchWorker()),
    fetchEmployer: () => dispatch(fetchEmployer()),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  send: {
    height: 44,
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
