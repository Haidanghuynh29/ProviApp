import React from 'react';
import {View, Text, StyleSheet, Linking} from 'react-native';

import global from '../style';
import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';

export default ({txtA, txtB, isUrl = false}) => {
  const open_url = () => {
    if (!isUrl || !txtB) {
      return;
    }

    Linking.canOpenURL(txtB).then((supported) => {
      if (supported) {
        Linking.openURL(txtB);
      }
    });
  };

  const style = isUrl ? [styles.txt_b, styles.link] : styles.txt_b;

  return (
    <View style={styles.container}>
      <Text style={styles.txt_a}>{txtA}</Text>
      <Text style={style} numberOfLines={1} onPress={open_url}>
        {txtB ?? ''}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    paddingHorizontal: 8,
    paddingVertical: 10,
    minHeight: 50,
  },
  txt_a: {
    fontSize: vw(3.5),
    lineHeight: vw(4),
    color: colors.text,
  },
  txt_b: {
    flex: 1,
    textAlign: 'right',
    fontSize: vw(3.5),
    lineHeight: vw(4),
    color: colors.text,
    marginLeft: 15,
  },
  link: {
    color: colors.blue,
  },
});
