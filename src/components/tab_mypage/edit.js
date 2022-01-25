import React, {PureComponent} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  LogBox,
} from 'react-native';

import EditBox from './_edit_box';
import IconItem from './_icon_edit';
import ImageItem from './_image_edit';
import Button from '../common/_btn';
import BtnIntroduction from '../common/_btn_introduction';
import VisibleSwitch from './_visible_switch';
import Indicator from '../common/indicator.js';

import * as API from '../../apis/api';
import {AppContext, SET_PROFILE} from '../../store/context';

import User from '../../models/user';

import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';
import * as Moment from '../../config/moment';
import {LABELS} from '../../config/constant';

const STR_IMGS = ['顔', 'バスト', '全身', '動画'];

export default class App extends PureComponent {
  static contextType = AppContext;

  constructor(props, context) {
    super(props, context);

    const {mode} = props.route.params;
    const {me} = context.state;

    this.state = {
      mode,
      visible: me.visible,
      kind: me.kind,
      email: me.email,
      nickname: me.nickname,
      introduction: me.introduction,
      unit: me.unit ?? 1,
      // worker
      img_face: me.img_face,
      img_best: me.img_best,
      img_full: me.img_full,
      video: me.video,
      birthday: me.birthday,
      hope_pay: me.hope_pay,
      hope_days: me.hope_days,
      hope_prefecture: me.hope_prefecture,
      hope_address: me.hope_address,
      exp_years: me.exp_years,
      exp_area: me.exp_area,
      prospect_sales: me.prospect_sales,
      prospect_count: me.prospect_count,
      prefecture: me.prefecture,
      address: me.address,
      b_size: me.b_size,
      w_size: me.w_size,
      h_size: me.h_size,
      height: me.height,
      job: me.job,
      // employer
      image: me.image,
      shop_name: me.shop_name,
      shop_telephone: me.shop_telephone,
      shop_url: me.shop_url,
      shop_prefecture: me.shop_prefecture,
      shop_address: me.shop_address,
      min_pay: me.min_pay,
      //
      token: me.token,
      created_at: me.created_at,
      img_face_temp: null,
      img_best_temp: null,
      img_full_temp: null,
      image_temp: null,
      video_temp: null,
    };
  }

  componentDidMount() {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
  }

  goScreen = () => {
    this.props.navigation.push('IntroductionScreen', {
      onBack: this.onChange,
      text: this.state.introduction,
    });
  };
  setObj = (txt, path, duration) => {
    const index = STR_IMGS.indexOf(txt);
    if (index == 0) {
      this.setState({img_face_temp: path});
    } else if (index == 1) {
      this.setState({img_best_temp: path});
    } else if (index == 2) {
      this.setState({img_full_temp: path});
    } else if (index == 3) {
      if (duration < 10 * 1000 || duration > 60 * 1000) {
        Alert.alert('', '10秒以上、60秒以下の動画をアップして下さい');
        return;
      }
      this.setState({video_temp: path});
    } else {
      this.setState({image_temp: path});
    }
  };
  onSwitch = (val) => this.setState({visible: val});
  onChange = (label, value) => {
    const index = Object.values(LABELS).indexOf(label);

    if (index > -1) {
      const obj = {};
      obj[Object.keys(LABELS)[index]] = value;
      this.setState(obj);
    } else {
      this.setState({introduction: value});
    }
  };
  onSubmit = () => {
    const {
      img_face,
      img_best,
      img_full,
      nickname,
      birthday,
      hope_pay,
      hope_days,
      hope_prefecture,
      hope_address,
      shop_name,
      image,
      shop_prefecture,
      shop_address,
      shop_telephone,
      img_face_temp,
      img_best_temp,
      img_full_temp,
      image_temp,
    } = this.state;

    if (this.state.kind) {
      if (
        (!img_face_temp && !img_face) ||
        (!img_best_temp && !img_best) ||
        (!img_full_temp && !img_full)
      ) {
        Alert.alert('写真を登録してください。');
        return;
      }
      if (
        !nickname ||
        !birthday ||
        !hope_pay ||
        !hope_days ||
        !hope_prefecture
      ) {
        Alert.alert('必須項目を入力してください。');
        return;
      }
    } else {
      if (!image_temp && !image) {
        Alert.alert('写真を登録してください。');
        return;
      }
      if (
        !nickname ||
        !shop_name ||
        !shop_prefecture ||
        !shop_address ||
        !shop_telephone
      ) {
        Alert.alert('必須項目を入力してください。');
        return;
      }
    }

    this.setState({loading: true});
    this.api__();
  };
  api__ = async () => {
    const {
      mode,
      img_face_temp,
      img_best_temp,
      img_full_temp,
      video_temp,
      image_temp,
    } = this.state;
    const me = new User(this.state, this.context.state.me.key);

    if (this.state.kind) {
      if (img_face_temp) {
        const url = await API.upload_image(
          `${API.USER}/${me.key}`,
          1,
          img_face_temp,
        );
        me.img_face = url.split(`${me.key}%2F`)[1];
      }
      if (img_best_temp) {
        const url = await API.upload_image(
          `${API.USER}/${me.key}`,
          2,
          img_best_temp,
        );
        me.img_best = url.split(`${me.key}%2F`)[1];
      }
      if (img_full_temp) {
        const url = await API.upload_image(
          `${API.USER}/${me.key}`,
          3,
          img_full_temp,
        );
        me.img_full = url.split(`${me.key}%2F`)[1];
      }
      if (video_temp) {
        const url = await API.upload_image(
          `${API.USER}/${me.key}`,
          4,
          video_temp,
        );
        me.video = url.split(`${me.key}%2F`)[1];
      }
    } else {
      if (image_temp) {
        const url = await API.upload_image(
          `${API.USER}/${me.key}`,
          1,
          image_temp,
        );
        me.image = url.split(`${me.key}%2F`)[1];
      }
    }

    me.updated_at = new Date().getTime();
    await API.update_user(me);
    this.context.dispatch({
      type: SET_PROFILE,
      point: me.point,
      me: me,
    });

    this.setState({loading: false});

    if (mode) {
      setTimeout(() => {
        this.props.navigation.navigate('ProfileShowScreen');
      }, 500);
    }
  };

  render() {
    const {me} = this.context.state;
    const {
      visible,
      mode,
      kind,
      loading,
      unit,
      img_face,
      img_best,
      img_full,
      video,
      image,
      img_face_temp,
      img_best_temp,
      img_full_temp,
      image_temp,
      video_temp,
    } = this.state;

    const states = [
      [img_face, img_face_temp],
      [img_best, img_best_temp],
      [img_full, img_full_temp],
      [video, video_temp],
    ];

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView contentContainerStyle={styles.scrollview}>
          <Indicator visible={loading} />

          {kind ? (
            <View style={styles.sub_imgs}>
              {STR_IMGS.map((txt, index) => (
                <IconItem
                  key={index}
                  text={txt}
                  isVideo={index === 3}
                  userKey={me.key}
                  path={states[index]}
                  setObj={this.setObj}
                />
              ))}
            </View>
          ) : (
            <ImageItem
              userKey={me.key}
              path={[image, image_temp]}
              setObj={this.setObj}
            />
          )}

          <View style={styles.content}>
            {mode == 1 && (
              <VisibleSwitch visible={visible} onChange={this.onSwitch} />
            )}
            <View style={styles.sub_content}>
              <Text style={styles.txt_title}>
                {kind ? '自己紹介' : '店舗紹介'}
              </Text>
              {this.state.introduction && (
                <Text style={styles.txt_intro}>{this.state.introduction}</Text>
              )}
              <BtnIntroduction onClick={this.goScreen} />
            </View>

            <Text style={styles.txt_title}>基本情報</Text>

            <EditBox
              // none: text, 1: number, 2: datepicker, 3: prefecture picker
              must={true}
              txtA={LABELS.nickname}
              txtB={this.state.nickname}
              onChange={this.onChange}
            />

            {kind ? (
              <>
                <EditBox
                  must={true}
                  txtA={LABELS.birthday}
                  txtB={Moment.timestamp(this.state.birthday)}
                  kind={2}
                  onChange={this.onChange}
                />
                <EditBox
                  must={true}
                  txtA={LABELS.hope_pay}
                  txtB={this.state.hope_pay}
                  kind={1}
                  unit={unit}
                  onChange={this.onChange}
                />
                <EditBox
                  must={true}
                  txtA={LABELS.hope_days}
                  txtB={this.state.hope_days}
                  kind={1}
                  onChange={this.onChange}
                />
                <EditBox
                  must={true}
                  kind={3}
                  txtA={LABELS.hope_prefecture}
                  txtB={this.state.hope_prefecture}
                  onChange={this.onChange}
                />
                <EditBox
                  txtA={LABELS.hope_address}
                  txtB={this.state.hope_address}
                  onChange={this.onChange}
                />
                <EditBox
                  txtA={LABELS.exp_years}
                  txtB={this.state.exp_years}
                  onChange={this.onChange}
                />
                <EditBox
                  kind={3}
                  txtA={LABELS.exp_area}
                  txtB={this.state.exp_area}
                  onChange={this.onChange}
                />
                <EditBox
                  txtA={LABELS.prospect_sales}
                  txtB={this.state.prospect_sales}
                  kind={1}
                  onChange={this.onChange}
                />
                <EditBox
                  txtA={LABELS.prospect_count}
                  txtB={this.state.prospect_count}
                  kind={1}
                  onChange={this.onChange}
                />
                <EditBox
                  txtA={LABELS.prefecture}
                  txtB={this.state.prefecture}
                  onChange={this.onChange}
                />
                {/* <EditBox
                  txtA={LABELS.address}
                  txtB={this.state.address}
                  onChange={this.onChange}
                /> */}
                <EditBox
                  txtA={LABELS.b_size}
                  txtB={this.state.b_size}
                  kind={1}
                  onChange={this.onChange}
                />
                <EditBox
                  txtA={LABELS.w_size}
                  txtB={this.state.w_size}
                  kind={1}
                  onChange={this.onChange}
                />
                <EditBox
                  txtA={LABELS.h_size}
                  txtB={this.state.h_size}
                  kind={1}
                  onChange={this.onChange}
                />
                <EditBox
                  txtA={LABELS.height}
                  txtB={this.state.height}
                  kind={1}
                  onChange={this.onChange}
                />
                <EditBox
                  txtA={LABELS.job}
                  txtB={this.state.job}
                  onChange={this.onChange}
                />
              </>
            ) : (
              <>
                <EditBox
                  must={true}
                  txtA={LABELS.shop_name}
                  txtB={this.state.shop_name}
                  onChange={this.onChange}
                />
                <EditBox
                  must={true}
                  kind={1}
                  txtA={LABELS.shop_telephone}
                  txtB={this.state.shop_telephone}
                  onChange={this.onChange}
                />
                <EditBox
                  must={true}
                  kind={3}
                  txtA={LABELS.shop_prefecture}
                  txtB={this.state.shop_prefecture}
                  onChange={this.onChange}
                />
                <EditBox
                  must={true}
                  txtA={LABELS.shop_address}
                  txtB={this.state.shop_address}
                  onChange={this.onChange}
                />
                <EditBox
                  txtA={LABELS.exp_years}
                  txtB={this.state.exp_years}
                  onChange={this.onChange}
                />
                <EditBox
                  txtA={LABELS.shop_url}
                  txtB={this.state.shop_url}
                  onChange={this.onChange}
                />
                <EditBox
                  kind={1}
                  unit={unit}
                  txtA={LABELS.min_pay}
                  txtB={this.state.min_pay}
                  onChange={this.onChange}
                />
              </>
            )}
          </View>
        </ScrollView>
        <Button text="保存する" onClick={this.onSubmit} />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    paddingTop: vh(2),
  },
  scrollview: {
    paddingBottom: vh(30),
  },
  img_user: {
    width: vw(76),
    height: undefined,
    aspectRatio: 1 / 1,
    marginVertical: vw(8),
    marginHorizontal: vw(12),
    alignSelf: 'center',
    borderRadius: vw(3),
  },
  btn_edit: {
    position: 'absolute',
    right: vw(3),
    bottom: vw(3),
    width: vw(12),
    height: vw(12),
    borderRadius: vw(6),
    backgroundColor: '#FFFFFFAA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sub_imgs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  content: {
    paddingBottom: vw(18),
    paddingHorizontal: vw(3),
  },
  txt_title: {
    color: colors.blue,
    fontSize: vw(4),
    fontWeight: 'bold',
    lineHeight: vw(5),
    marginBottom: vw(3),
  },
  txt_intro: {
    color: colors.text,
    fontSize: vw(4),
    lineHeight: vw(5),
    marginBottom: vw(3),
  },
  sub_content: {
    marginVertical: vh(1.5),
  },
});
