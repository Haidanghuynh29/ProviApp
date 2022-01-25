import React, { PureComponent } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import {vw, vh} from '../../config/dimen'
import colors from '../../config/colors';

const IMG = require('../../../assets/images/img_btn.png');

export default App = ({text, onClick}) => {
  return (
    <TouchableOpacity onPress={onClick}>
      <FastImage
        style={styles.img}
        source={IMG}/>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  img: {
    width: '100%',
    height: undefined,
    aspectRatio: 69/12,
  }
})