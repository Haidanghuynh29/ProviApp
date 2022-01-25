import React, {PureComponent} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Alert} from 'react-native';

import {connect} from 'react-redux';
import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
import ImageView from 'react-native-image-view';
import ActionSheet from 'react-native-actionsheet';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ParallaxScrollView from 'react-native-parallax-scroll-view';

import TextBox from '../common/_txt_box';
import Button from '../common/_btn';
import StateBox from '../common/_user_status';
import Dialog from '../common/_dialog';
import Indicator from '../common/indicator';

import * as API from '../../apis/api';
import {AppContext, SET_POINT} from '../../store/context';
import {fetchFavIds, fetchBlockingIds, fetchChat} from '../../actions';

import global from '../style';
import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';
import * as Moment from '../../config/moment';
import {LABELS} from '../../config/constant';
import * as Helper from '../../config/helper';

var paths = [];

class App extends PureComponent {
  static contextType = AppContext;

  constructor(props, context) {
    super(props, context);

    const {me} = this.context.state;
    const {params} = props.route;
    const user = params ? params.user : me;

    this.state = {
      image: user.kind ? user.img_face : user.image,
      video: null,
      user: user,
      kind: user.kind,
      isImageViewVisible: false,
      visibleDlg: false,
      loading: false,

      cnt_scout: null,
      cnt_interview: null,
      cnt_cancel: null,
      cnt_follower: null,
    };

    paths = [user.img_face, user.img_best, user.img_full];
    if (user.video) {
      paths.push(user.video);
    }
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={global.menu}
          onPress={() => this.ActionEdit.show()}>
          <FontAwesome5 name={'ellipsis-h'} size={vw(5)} color={'white'} />
        </TouchableOpacity>
      ),
    });

    this.api_status();
  }

  onAction = (index) => {
    if (!index) {
      const {user} = this.state;
      const {blocking_ids} = this.props.userReducer;
      this.props.fetchBlockingIds(blocking_ids, user.key, !this.is_block());
      this.props.navigation.goBack();
    }
  };
  api_status = async () => {
    const {user} = this.state;
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
  onClickItem = (index) => () => {
    const isVideo = index == 3;
    this.setState({
      image: isVideo ? null : paths[index],
      video: isVideo ? paths[index] : null,
    });
  };
  onFav = (flag) => () => {
    const {user} = this.state;
    const {me} = this.context.state;
    const {fav_ids} = this.props.userReducer;
    this.props.fetchFavIds(fav_ids, user.key, flag);
    if (flag) {
      API.send_fcm(API.fcm_like(user.token, me.nickname));
    }
  };

  onRequest = () => {
    this.setState({visibleDlg: true});
  };
  onDlgClick = (flag) => () => {
    const {me, point} = this.context.state;

    this.setState({visibleDlg: false}, () => {
      if (flag) {
        // const canRequest = !this.is_block() && !this.is_exist();

        // if (!me.kind && point < 1000) {
        //   this.pointless();
        // } else {

        this.setState({loading: true});
        this.api_create_chat();
      }
    });
  };

  get_status = (kind = 0) => {
    const {user} = this.state;
    const {me} = this.context.state;
    const {chats} = this.props.chatReducer;

    const exists = chats.filter((c) => {
      const key = me.kind ? c.employer_key : c.worker_key;
      return key === user.key;
    });
    if (exists.length < 1) {
      return !kind ? -1 : null;
    } else {
      return !kind ? exists[0].status : exists[0];
    }
  };
  is_block = () => {
    const {user} = this.state;
    const {blocking_ids} = this.props.userReducer;
    return blocking_ids.includes(user.key);
  };

  pointless = () => {
    setTimeout(() => {
      Alert.alert(
        'ポイントがありません',
        'ポイント購入へ飛ぶ',
        [
          {
            text: '確認',
            onPress: () =>
              this.props.navigation.navigate('TabMypage', {
                screen: 'PurchageScreen',
              }),
          },
        ],
        {cancelable: false},
      );
    }, 500);
  };
  api_create_chat = async () => {
    const {me, point} = this.context.state;
    const {user} = this.state;
    const temp = {
      employer_key: me.kind ? user.key : me.key,
      worker_key: me.kind ? me.key : user.key,
      status: me.kind,
      w_cnt: me.kind ? 0 : 1,
      e_cnt: me.kind ? 1 : 0,
    };
    // this.context.dispatch({
    //   type: SET_POINT,
    //   point: point - 1000,
    // });

    const chat = this.get_status(1);

    const {chats} = this.props.chatReducer;
    if (!chat) {
      this.props.fetchChat(0, chats, temp, 1);

      if (me.kind) {
        API.fcm_request(user.token, me.nickname);
      } else {
        API.fcm_scout(user.token, me.nickname);
      }
    } else {
      this.props.fetchChat(0, chats, chat, 2);
    }

    this.setState({loading: false});
  };

  renderButton = (isExist) => {
    const {me} = this.context.state;
    let str = '';
    if (me.is_worker()) {
      str = isExist ? '面接リクエスト中止' : '面接リクエスト';
    } else {
      str = isExist ? 'スカウト中止' : 'スカウトする';
    }

    return <Button kind={1} text={str} onClick={this.onRequest} />;
  };
  render() {
    const {me} = this.context.state;
    const {
      user,
      kind,
      image,
      video,
      isImageViewVisible,
      visibleDlg,
      loading,
      cnt_scout,
      cnt_interview,
      cnt_cancel,
      cnt_follower,
    } = this.state;
    const {fav_ids} = this.props.userReducer;

    const isFav = fav_ids.includes(user.key);

    const isBlock = this.is_block();
    const getStatus = this.get_status();
    const isExist = getStatus !== -1;

    const dialogText = me.kind
      ? isExist
        ? '面接リクエストを中止します。'
        : '面接リクエストを送りします'
      : isExist
      ? 'スカウトを中止します。'
      : '本当にスカウト通知をしますか';
    // : 'スカウトするため\n1000ポイントを消費します'

    const urls = kind
      ? [
          user.getUrl(user.img_face),
          user.getUrl(user.img_best),
          user.getUrl(user.img_full),
        ]
      : [user.getUrl(user.image)];
    const images = urls.map((url, _) => {
      return {
        source: {
          uri: url,
        },
        title: '',
      };
    });

    return (
      <View style={styles.container}>
        <Indicator visible={loading} />

        <ParallaxScrollView
          backgroundColor="white"
          contentBackgroundColor="white"
          headerHeight={vw(kind ? 100 : 90)}
          isHeaderFixed={true}
          parallaxHeaderHeight={vw(kind ? 100 : 90)}
          renderForeground={() => (
            <>
              {image ? (
                <TouchableOpacity
                  onPress={() => this.setState({isImageViewVisible: true})}>
                  <FastImage
                    style={styles.img_user}
                    source={{uri: user.getUrl(image)}}
                  />
                </TouchableOpacity>
              ) : (
                <Video
                  source={{uri: user.getUrl(video)}}
                  style={styles.img_user}
                  controls={true}
                  resizeMode="cover"
                />
              )}

              <TouchableOpacity
                style={[styles.btn_like, global.bebel]}
                onPress={this.onFav(!isFav)}>
                <FontAwesome5
                  name={'heart'}
                  size={vw(7)}
                  color={isFav ? colors.pink : 'lightgray'}
                  solid
                />
              </TouchableOpacity>

              {kind == 1 && (
                <View style={styles.sub_imgs}>
                  {paths.map((path, index) => (
                    <Item
                      key={index}
                      index={index}
                      path={user.getUrl(path)}
                      onClick={this.onClickItem}
                    />
                  ))}
                </View>
              )}

              <ImageView
                images={images}
                imageIndex={0}
                isVisible={isImageViewVisible}
                onClose={() => this.setState({isImageViewVisible: false})}
                renderFooter={(currentImage) => <View />}
              />
            </>
          )}>
          <View style={[styles.content, kind ? {} : {paddingTop: vw(0)}]}>
            <StateBox
              values={
                kind
                  ? [cnt_scout, cnt_interview, cnt_cancel, cnt_follower]
                  : [cnt_scout, cnt_interview, cnt_cancel, cnt_follower]
              }
            />

            <Text style={styles.txt_title}>
              {kind ? '自己紹介' : '店舗紹介'}
            </Text>
            <TextBox txtA={user.introduction ?? ''} />

            <Text style={styles.txt_title}>基本情報</Text>

            <TextBox txtA={LABELS.nickname} txtB={user.nickname} />
            {kind ? (
              <>
                <TextBox
                  txtA={LABELS.birthday}
                  txtB={Moment.timestamp(user.birthday)}
                />
                <TextBox
                  txtA={LABELS.hope_pay}
                  txtB={`${Helper.number_delimiter(
                    user.hope_pay ?? 0,
                  )}${Helper.get_unit(user.unit ?? 1)}`}
                />
                <TextBox txtA={LABELS.hope_days} txtB={user.hope_days} />
                <TextBox
                  txtA={LABELS.hope_prefecture}
                  txtB={user.hope_prefecture}
                />
                <TextBox txtA={LABELS.hope_address} txtB={user.hope_address} />
                <TextBox txtA={LABELS.exp_years} txtB={user.exp_years} />
                <TextBox txtA={LABELS.exp_area} txtB={user.exp_area} />
                <TextBox
                  txtA={LABELS.prospect_sales}
                  txtB={user.prospect_sales}
                />
                <TextBox
                  txtA={LABELS.prospect_count}
                  txtB={user.prospect_count}
                />
                <TextBox txtA={LABELS.prefecture} txtB={user.prefecture} />
                {/* <TextBox txtA={LABELS.address} txtB={user.address} /> */}
                <TextBox txtA={LABELS.b_size} txtB={user.b_size} />
                <TextBox txtA={LABELS.w_size} txtB={user.w_size} />
                <TextBox txtA={LABELS.h_size} txtB={user.h_size} />
                <TextBox txtA={LABELS.height} txtB={user.height} />
                <TextBox txtA={LABELS.job} txtB={user.job} />
              </>
            ) : (
              <>
                <TextBox txtA={LABELS.shop_name} txtB={user.shop_name} />
                <TextBox
                  txtA={LABELS.shop_telephone}
                  txtB={user.shop_telephone}
                />
                <TextBox
                  txtA={LABELS.shop_prefecture}
                  txtB={user.shop_prefecture}
                />
                <TextBox txtA={LABELS.shop_address} txtB={user.shop_address} />
                <TextBox txtA={LABELS.exp_years} txtB={user.exp_years} />
                <TextBox
                  txtA={LABELS.shop_url}
                  txtB={user.shop_url ?? ''}
                  isUrl={true}
                />
                <TextBox
                  txtA={LABELS.min_pay}
                  txtB={`${Helper.number_delimiter(
                    user.min_pay ?? 0,
                  )}${Helper.get_unit(user.unit ?? 1)}`}
                />
              </>
            )}
          </View>
        </ParallaxScrollView>

        {getStatus < 2 && this.renderButton(isExist)}

        <Dialog
          visible={visibleDlg}
          text={dialogText}
          onClick={this.onDlgClick}
        />

        <ActionSheet
          ref={(o) => (this.ActionEdit = o)}
          title={''}
          options={[
            isBlock ? 'ブロックを解除' : 'ユーザーをブロック',
            'キャンセル',
          ]}
          cancelButtonIndex={isBlock ? 0 : 1}
          destructiveButtonIndex={0}
          onPress={(index) => this.onAction(index)}
        />
      </View>
    );
  }
}

const Item = ({path, index, onClick}) => {
  return (
    <TouchableOpacity onPress={onClick(index)}>
      {index == 3 ? (
        <Video
          source={{uri: path}}
          style={styles.icon_user}
          paused={true}
          resizeMode="cover"
        />
      ) : (
        <FastImage style={styles.icon_user} source={{uri: path}} />
      )}
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
    fetchFavIds: (ids, id, flag) => dispatch(fetchFavIds(ids, id, flag)),
    fetchBlockingIds: (ids, id, flag) =>
      dispatch(fetchBlockingIds(ids, id, flag)),
    fetchChat: (kind, chats, chat, flag) =>
      dispatch(fetchChat(kind, chats, chat, flag)),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'white',
  },
  img_user: {
    width: '100%',
    height: undefined,
    aspectRatio: 1 / 0.9,
    paddingBottom: vw(12),
  },
  btn_like: {
    position: 'absolute',
    right: vw(3),
    top: vw(3),
    width: vw(12),
    height: vw(12),
    borderRadius: vw(6),
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sub_imgs: {
    zIndex: 10,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    left: vw(5),
    right: vw(5),
    top: vw(80),
    justifyContent: 'space-between',
  },
  icon_user: {
    width: vw(18),
    height: undefined,
    aspectRatio: 1 / 1,
    borderRadius: vw(2),
    borderWidth: vw(0.7),
    borderColor: 'white',
  },
  content: {
    paddingTop: vw(0),
    paddingBottom: vw(20),
    paddingHorizontal: vw(3),
  },
  txt_title: {
    color: colors.blue,
    fontSize: vw(4),
    fontWeight: 'bold',
    lineHeight: vw(5),
    marginTop: vh(2),
  },
});
