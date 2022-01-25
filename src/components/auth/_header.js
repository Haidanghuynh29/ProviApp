import React, { PureComponent } from 'react'
import {
  Text,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import styles from './style'

const IMG_TITLE = require('../../../assets/images/icon.png');

export default App = () => {
  return (
    <>
      <Text style={styles.txt_logo}>
        {`ナイトワークの${'\n'}オーディションアプリ${'\n'}`}
        <Text style={styles.txt_bigger}>Provi</Text>
      </Text>
      <FastImage
        source={IMG_TITLE}
        resizeMode={'contain'}
        style={styles.img_title} />
    </>
  )
}
