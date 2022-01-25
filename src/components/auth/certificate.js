import React, {PureComponent} from 'react';
import {View, StyleSheet, Text, Alert, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';

import Button from '../common/_btn';
import Indicator from '../common/indicator.js';

import * as API from '../../apis/api';
import {AppContext, SET_PROFILE} from '../../store/context';

import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';

const optionImage = {
  width: 1000,
  height: 1000,
  cropping: true,
};
const IMG = require('../../../assets/images/certificate.png');

export default class App extends PureComponent {
  static contextType = AppContext;

  constructor(props, context) {
    super(props, context);

    this.state = {
      loading: false,
      image: null,
    };
  }

  on_action = (index) => {
    switch (index) {
      case 0:
        ImagePicker.openPicker(optionImage)
          .then((obj) => {
            this.setState({image: obj.path});
          })
          .catch((e) => {
            console.log(e);
          });
        break;
      case 1:
        ImagePicker.openCamera(optionImage)
          .then((obj) => {
            this.setState({image: obj.path});
          })
          .catch((e) => {
            console.log(e);
          });
        break;
    }
  };
  on_submit = () => {
    const {image} = this.state;

    if (!image) {
      Alert.alert('営業許可証を添付してください。');
      return;
    }

    this.setState({loading: true});
    this.api__();
  };

  api__ = async () => {
    const {image} = this.state;
    const uid = API.current_uid();
    // const {me} = this.context.state;

    const fullUrl = await API.upload_image(
      `${API.USER}/${uid}`,
      'certificate',
      image,
    );
    const url = fullUrl.split(`${uid}%2F`)[1];
    await API.update_user_field({
      kind: 0,
      email: API.current_user().email,
      blocked: true,
      imgCertificate: url,
    });

    setTimeout(() => {
      Alert.alert(
        '',
        'Provi運営チームで添付写真を確認して認証メールを送信します。お待ち下さい。',
        [
          {
            text: 'キャンセル',
          },
          {
            text: '確認',
            style: 'cancel',
            onPress: () => {
              this.props.navigation.navigate('SignInScreen');
            },
          },
        ],
        {cancelable: false},
      );
    }, 700);
  };

  render() {
    const {me} = this.context.state;
    const {loading, image} = this.state;
    const src = image ? {uri: image} : IMG;

    return (
      <View style={styles.container}>
        <Indicator visible={loading} />

        <TouchableOpacity onPress={() => this.ActionEdit.show()}>
          <FastImage source={src} style={styles.image} resizeMode="contain" />
        </TouchableOpacity>

        <Text style={styles.text}>
          所属店舗の営業許可証の写真を添付して下さい。
        </Text>

        <Button text="提出する" onClick={this.on_submit} />

        <ActionSheet
          ref={(o) => (this.ActionEdit = o)}
          title={''}
          destructiveButtonIndex={2}
          options={['アルバム', 'カメラ', 'キャンセル']}
          onPress={(index) => this.on_action(index)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 30,
  },
  image: {
    width: vw(80),
    height: undefined,
    aspectRatio: 1 / 1,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
    alignSelf: 'center',
  },
  text: {
    fontSize: 16,
    color: colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
  },
});
