import React, {PureComponent} from 'react';
import {FlatList, RefreshControl, StyleSheet} from 'react-native';
import {connect} from 'react-redux';

import MessageItem from './_message';

import * as API from '../../apis/api';
import {AppContext} from '../../store/context';
import {fetchChat, fetchBlockingIds, fetchBlockedIds} from '../../actions';

import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';

class App extends PureComponent {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {};
  }

  UNSAFE_componentWillMount() {
    this.onFocus = this.props.navigation.addListener('focus', () => {
      this.onRefresh();
    });
  }
  componentWillUnmount() {
    this.onFocus();
  }

  onRefresh = () => {
    const {me} = this.context.state;
    this.props.fetchChat(me.kind);
  };

  render() {
    const {me} = this.context.state;
    const {mode} = this.props.route.params;
    const {blocking_ids, blocked_ids} = this.props.userReducer;
    const {chats, fetchingChat} = this.props.chatReducer;

    let data = chats.filter((chat) =>
      mode ? chat.status >= 3 : chat.status < 3 && chat.status !== me.kind,
    );
    data = data.filter(
      (d) => !blocked_ids.includes(me.kind ? d.employer_key : d.worker_key),
    );
    if (this.state.mode) {
      data = data.filter(
        (d) => !blocking_ids.includes(me.kind ? d.employer_key : d.worker_key),
      );
    } else {
      data = data.filter(
        (d) => !blocking_ids.includes(me.kind ? d.employer_key : d.worker_key),
      );

      //reset badges
      data.map((d) => {
        if ((me.kind && d.w_cnt) || (!me.kind && d.e_cnt)) {
          API.reset_badge(d.key, me.kind);
        }
      });
    }

    return (
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={fetchingChat}
            onRefresh={this.onRefresh}
            tintColor="gray"
          />
        }
        data={data}
        initialNumToRender={10}
        renderItem={({item, index}) => (
          <MessageItem
            key={index}
            chat={item}
            mode={mode}
            navigation={this.props.navigation}
          />
        )}
        keyExtractor={(_, index) => `${index}`}
        contentInset={{bottom: 30}}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    userReducer: state.userReducer,
    chatReducer: state.chatReducer,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    fetchChat: (kind) => dispatch(fetchChat(kind)),
    fetchBlockingIds: () => dispatch(fetchBlockingIds()),
    fetchBlockedIds: () => dispatch(fetchBlockedIds()),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(App);

const styles = StyleSheet.create({
  content: {
    justifyContent: 'space-between',
    marginHorizontal: 5,
    paddingTop: 15,
  },
});
