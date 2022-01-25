import React, {PureComponent} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import FastImage from 'react-native-fast-image';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import * as API from '../../apis/api';
import {AppContext} from '../../store/context';
import {fetchWorker, fetchEmployer, fetchFavIds} from '../../actions';

import global from '../style';
import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';
import * as Moment from '../../config/moment';
import * as Helper from '../../config/helper';

class App extends PureComponent {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {};
  }

  onFav = (flag) => () => {
    const {user} = this.props;
    const {me} = this.context.state;
    const {fav_ids} = this.props.userReducer;
    this.props.fetchFavIds(fav_ids, user.key, flag);
    if (flag) {
      API.send_fcm(API.fcm_like(user.token, me.nickname));
    }
  };

  goDetail = () => {
    const {user, navigation} = this.props;
    navigation.push('ProfileScreen', {user: user});
  };

  render() {
    const {user} = this.props;
    const {fav_ids} = this.props.userReducer;
    const src = {uri: user.getUrl()};

    const isFav = fav_ids.includes(user.key);

    return (
      <TouchableOpacity style={styles.container} onPress={this.goDetail}>
        <View style={global.bebel}>
          <FastImage style={styles.img_user} source={src}>
            <TouchableOpacity
              style={[styles.btn_like, global.bebel]}
              onPress={this.onFav(!isFav)}>
              <FontAwesome5
                name={'heart'}
                size={vw(5)}
                color={isFav ? colors.pink : 'lightgray'}
                solid
              />
            </TouchableOpacity>
          </FastImage>
        </View>

        <Text style={styles.txt_title}>
          {`${user.kind ? Moment.getAge(user.birthday) + '才' : ''} ${
            user.nickname
          }さん`}
        </Text>

        {user.kind ? (
          <>
            <Text style={styles.txt_detail}>
              {`希望給料：${Helper.number_delimiter(
                user.hope_pay ?? 0,
              )}${Helper.get_unit(user.unit ?? 1)}`}
            </Text>
            <Text style={styles.txt_detail}>
              {`希望勤務日数：${user.hope_days}日`}
            </Text>
            <Text style={styles.txt_detail}>
              {`希望勤務地：${user.hope_prefecture ?? '未定'}`}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.txt_detail}>
              {`所属店舗名：${user.shop_name}`}
            </Text>
            <Text style={styles.txt_detail}>
              {`店舗住所地：${user.shop_prefecture ?? '未定'}`}
            </Text>
            <Text style={styles.txt_detail}>
              最低給料：
              {user.min_pay
                ? Helper.number_delimiter(user.min_pay) +
                  Helper.get_unit(user.unit ?? 1)
                : '未定'}
            </Text>
          </>
        )}
        {/* <Text style={styles.txt_detail}>
          いいね数：５
        </Text>
        <Text style={styles.txt_detail}>
          最終ログイン日：２０２０年3月
        </Text> */}
      </TouchableOpacity>
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
    fetchFavIds: (ids, id, flag) => dispatch(fetchFavIds(ids, id, flag)),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(App);

const styles = StyleSheet.create({
  container: {
    width: vw(45),
  },
  img_user: {
    width: '100%',
    height: undefined,
    aspectRatio: 1 / 1,
    borderRadius: vw(2),
    position: 'relative',
  },
  btn_like: {
    position: 'absolute',
    top: vw(1.5),
    right: vw(1.5),
    width: vw(9),
    height: vw(9),
    backgroundColor: 'white',
    borderRadius: vw(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt_title: {
    color: colors.blue,
    fontSize: vw(3.5),
    fontWeight: 'bold',
    lineHeight: vw(4.5),
    marginTop: vh(1),
  },
  txt_detail: {
    color: colors.text,
    fontSize: vw(3),
    lineHeight: vw(4.5),
  },
});
