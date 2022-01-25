import React, {PureComponent} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import Header from './_header';

import styles from './style';
import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';

const IMG_BK = require('../../../assets/images/bk_logo.jpg');

export default class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      loading: false,
    };
  }

  onSubmit = (kind) => () => {
    this.props.navigation.push('SignUpScreen', {kind: kind});
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <FastImage source={IMG_BK} style={styles.container}>
          <Header />

          <View style={styles.content}>
            <TouchableOpacity style={styles.btn} onPress={this.onSubmit(1)}>
              <Text style={styles.txt_btn}>働くお店を探す</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btn,
                {
                  backgroundColor: colors.cyan,
                  marginTop: vh(3),
                },
              ]}
              onPress={this.onSubmit(0)}>
              <Text style={[styles.txt_btn, {color: colors.text}]}>
                働く女性を見つける
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{marginTop: vh(3)}}
              onPress={this.props.navigation.goBack}>
              <Text style={styles.txt_btn}>戻る</Text>
            </TouchableOpacity>
          </View>
        </FastImage>
      </TouchableWithoutFeedback>
    );
  }
}
