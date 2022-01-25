import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import global from '../style';
import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';

export default ({text, navigation}) => {
  const onClick = () => {
    navigation.push('PurchageScreen');
  };

  return (
    <TouchableOpacity style={[global.bebel, styles.btn]} onPress={onClick}>
      <Text style={styles.txt_btn}>{text}</Text>
      <FontAwesome5
        name={'chevron-right'}
        size={vw(4)}
        style={styles.icon}
        color={colors.blue}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    height: 44,
    width: vw(90),
    backgroundColor: colors.beige,
    borderRadius: vw(2),
    borderColor: colors.blue,
    borderWidth: vw(0.5),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: vh(1),
  },
  txt_btn: {
    fontSize: vw(4),
    color: colors.blue,
    fontWeight: 'bold',
  },
  icon: {
    position: 'absolute',
    right: vw(5),
  },
});
