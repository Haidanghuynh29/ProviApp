import React, {PureComponent} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import moment from 'moment';

import * as API from '../../apis/api';
import {AppContext, SET_PROFILE, SET_BADGE_ADMIN} from '../../store/context';

import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';

export default class App extends PureComponent {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    const {notification} = props.route.params;
    this.state = {
      notification,
    };
  }

  componentDidMount() {
    const {me} = this.context.state;
    const {notification} = this.state;

    if (!me.ck_notify_ids.includes(notification.key)) {
      me.ck_notify_ids.push(notification.key);
      this.context.dispatch({type: SET_PROFILE, me});
      if (notification.inquiry_key) {
        this.context.dispatch({type: SET_BADGE_ADMIN});
      }
    }

    API.update_notify_state(notification.key);
  }

  render() {
    const {notification} = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.box}>
          <View style={styles.header}>
            <Text style={styles.txt_date}>
              {moment(notification.ctime).format('M月D日HH:mm')}
            </Text>
            <Text style={styles.txt_title}>{notification.title}</Text>
          </View>
          <Text style={styles.txt_content}>{notification.content}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    flex: 1,
    margin: vw(3),
    elevation: 1,
    shadowColor: 'black',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 1,
    backgroundColor: 'white',
    borderRadius: vw(3),
    padding: vw(3),
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    margin: 0,
    padding: 0,
  },
  txt_title: {
    fontSize: vw(4.5),
    marginTop: vw(3),
  },
  txt_content: {
    flex: 1,
    fontSize: vw(3.5),
    lineHeight: vw(4),
    paddingTop: vw(3),
  },
  txt_date: {
    textAlign: 'right',
    fontSize: vw(3.5),
    color: 'lightgray',
  },
});
