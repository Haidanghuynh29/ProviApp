import React, {PureComponent} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ActionSheet from 'react-native-actionsheet';
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

export default class App extends PureComponent {
  onAction = (index) => {
    const {setObj} = this.props;

    switch (index) {
      case 0:
        ImagePicker.openPicker(optionImage)
          .then((obj) => {
            setObj(null, obj.path);
          })
          .catch((e) => {
            console.log(e);
          });
        break;
      case 1:
        ImagePicker.openCamera(optionImage)
          .then((obj) => {
            setObj(null, obj.path);
          })
          .catch((e) => {
            console.log(e);
          });
        break;
    }
  };

  render() {
    const {path, userKey} = this.props;

    var src = IMG;
    if (path[0] && !path[1]) {
      src = {uri: FIREBASE_IMAGE(`users%2F${userKey}`, path[0])};
    } else if (path[1]) {
      src = {uri: path[1]};
    }

    return (
      <View style={[styles.container, global.bebel]}>
        <FastImage source={src} style={styles.icon} />

        <TouchableOpacity
          style={[styles.btn_edit, global.bebel]}
          onPress={() => this.ActionEdit.show()}>
          <FontAwesome5 name={'camera'} size={vw(7)} color={colors.darkgray} />
        </TouchableOpacity>

        <ActionSheet
          ref={(o) => (this.ActionEdit = o)}
          title={''}
          options={['アルバム', 'カメラ']}
          onPress={(index) => this.onAction(index)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: vw(70),
    height: vw(70),
    alignSelf: 'center',
    borderRadius: vw(3),
    overflow: 'hidden',
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  btn_edit: {
    position: 'absolute',
    alignItems: 'center',
    right: vw(3),
    bottom: vw(3),
    width: vw(12),
    height: vw(12),
    borderRadius: vw(6),
    backgroundColor: '#FFFFFFAA',
    justifyContent: 'center',
  },
});
