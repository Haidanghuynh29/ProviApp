import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import FastImage from 'react-native-fast-image';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ActionSheet from 'react-native-actionsheet';
import Video from 'react-native-video';
import ImagePicker from 'react-native-image-crop-picker';

import global from '../style';
import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';
import {FIREBASE_IMAGE} from '../../config/constant';

const IMG = require('../../../assets/images/bk_icon.jpg');
const optionImage = {
  width: 500,
  height: 500,
  cropping: true,
};
const optionVideo = {
  mediaType: 'video',
};

export default class App extends PureComponent {
  onAction = (index) => {
    const {text, isVideo, setObj} = this.props;
    const option = isVideo ? optionVideo : optionImage;

    switch (index) {
      case 0:
        ImagePicker.openPicker(option)
          .then((obj) => {
            setObj(text, obj.path, isVideo ? obj.duration : 0);
          })
          .catch((e) => {
            console.log(e);
          });
        break;
      case 1:
        ImagePicker.openCamera(option)
          .then((obj) => {
            setObj(text, obj.path, isVideo ? obj.duration : 0);
          })
          .catch((e) => {
            console.log(e);
          });
        break;
    }
  };

  onBuffer = (e) => {};
  videoError = (e) => {
    Alert.alert('動画を取得できません。');
  };

  render() {
    const {text, path, isVideo, userKey} = this.props;

    var src = IMG;
    if (path[0] && !path[1]) {
      src = {uri: FIREBASE_IMAGE(`users%2F${userKey}`, path[0])};
    } else if (path[1]) {
      src = {uri: path[1]};
    }

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => this.ActionEdit.show()}>
        {isVideo && (path[0] || path[1]) ? (
          <Video
            source={src} // Can be a URL or a local file.
            ref={(ref) => {
              this.player = ref;
            }}
            resizeMode="cover"
            onBuffer={this.onBuffer} // Callback when remote video is buffering
            onError={this.videoError} // Callback when video cannot be loaded
            style={styles.icon}
          />
        ) : (
          <FastImage source={src} style={styles.icon} />
        )}

        <View style={styles.content}>
          <View style={[styles.btn_edit, global.bebel]}>
            <FontAwesome5
              name={isVideo ? 'video' : 'camera'}
              size={vw(5)}
              color={colors.darkgray}
              solid
            />
          </View>
          <Text style={styles.txt_kind}>{text}</Text>
        </View>

        <ActionSheet
          ref={(o) => (this.ActionEdit = o)}
          title={''}
          options={['アルバム', 'カメラ']}
          onPress={(index) => this.onAction(index)}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: vw(22),
    height: vw(22),
    borderRadius: vw(2),
    overflow: 'hidden',
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  content: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    top: vw(3),
  },
  btn_edit: {
    width: vw(10),
    height: vw(10),
    borderRadius: vw(5),
    backgroundColor: '#FFFFFFAA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt_kind: {
    fontSize: vw(3.5),
    lineHeight: vw(5),
    color: 'white',
  },
});
