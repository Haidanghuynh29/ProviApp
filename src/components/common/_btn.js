import React, {PureComponent} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import global from '../style';
import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';

export default ({text, onClick, kind = 0}) => {
  return (
    <TouchableOpacity style={[global.bebel, styles.btn]} onPress={onClick}>
      <Text style={styles.txt_btn}>{text}</Text>
      {kind == 0 && (
        <FontAwesome5
          name={'chevron-right'}
          size={vw(4)}
          style={styles.icon}
          color={colors.text}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    height: 44,
    width: vw(90),
    backgroundColor: colors.brown,
    borderRadius: vw(2),
    position: 'absolute',
    bottom: 35,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt_btn: {
    fontSize: vw(4),
    color: colors.text,
    fontWeight: 'bold',
  },
  icon: {
    position: 'absolute',
    right: vw(5),
  },
});
