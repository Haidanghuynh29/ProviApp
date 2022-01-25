import React, {PureComponent} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import global from '../style';
import colors from '../../config/colors';
import {vw, vh} from '../../config/dimen';
import * as Moment from '../../config/moment';

export default class App extends PureComponent {
  constructor(props) {
    super(props);
  }

  onClick = () => {
    const {navigation, notification} = this.props;
    navigation.push('NotificationDetailScreen', {notification: notification});
  };

  render() {
    const {notification, isNew = false} = this.props;

    return (
      <TouchableOpacity style={styles.container} onPress={this.onClick}>
        <View style={styles.content}>
          <View style={styles.flex}>
            <Text style={styles.txt_time}>
              {Moment.timestamp(notification.timestamp)}
            </Text>
            {isNew && <Text style={styles.status}>NEW</Text>}
          </View>

          <Text style={styles.txt_title} numberOfLines={2}>
            {notification.title}
          </Text>
          <Text style={styles.txt_content} numberOfLines={2}>
            {notification.content}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: vh(1),
  },
  img_user: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  content: {
    flex: 1,
    marginHorizontal: vw(4),
    paddingBottom: vh(1),
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgray',
  },
  txt_time: {
    fontSize: vw(3),
    lineHeight: vw(5),
    color: colors.blue,
  },
  txt_title: {
    fontSize: vw(4),
    lineHeight: vw(5),
    color: colors.text,
    flexShrink: 1,
  },
  txt_content: {
    fontSize: vw(3),
    lineHeight: vw(4),
    color: 'gray',
    flexShrink: 1,
  },
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  status: {
    color: colors.red,
  },
});
