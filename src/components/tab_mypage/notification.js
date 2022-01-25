import React, {PureComponent} from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';

import Item from '../common/_notify';

import * as API from '../../apis/api';
import {AppContext, SET_BADGE_ADMIN} from '../../store/context';

import global from '../style';

export default class App extends PureComponent {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      notifications: [],
    };

    this.api_();
  }

  componentDidMount() {
    const {navigation} = this.props;

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={Linking.openSettings}>
          <Text style={styles.txt}>通知設定</Text>
        </TouchableOpacity>
      ),
    });

    this.context.dispatch({
      type: SET_BADGE_ADMIN,
      badgeAdmin: null,
    });
  }

  api_ = async () => {
    const notifications = await API.get_notifications();
    this.setState({loading: false, notifications});
  };
  onRefresh = () => {
    this.setState({loading: true});
    this.api_();
  };

  render() {
    const {me} = this.context.state;
    const {loading, notifications} = this.state;

    return (
      <View style={{flex: 1}}>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={this.onRefresh}
              tintColor="gray"
            />
          }
          data={notifications}
          initialNumToRender={10}
          renderItem={({item, index}) => (
            <Item
              key={index}
              notification={item}
              isNew={!me.ck_notify_ids.includes(item.key)}
              navigation={this.props.navigation}
            />
          )}
          keyExtractor={(_, index) => `${index}`}
          contentInset={{bottom: 30}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  txt: {
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 16,
  },
});
