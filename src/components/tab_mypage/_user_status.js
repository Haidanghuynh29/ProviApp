import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';

export default ({values}) => {
  const strs = ['総スカウト', '面接実績', `面接${'\n'}キャンセル`, 'いいね'];

  return (
    <View style={styles.container}>
      {values.map((value, i) => (
        <View key={i} style={styles.item}>
          <View style={styles.content}>
            <Text style={styles.txt}>{strs[i] ?? 0}</Text>
          </View>

          <Text style={styles.txt_count}>
            {value}
            <Text style={styles.txt}>件</Text>
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: vh(1.5),
  },
  content: {
    height: vw(10),
    justifyContent: 'center',
  },
  item: {
    width: vw(22),
    height: vw(22),
    backgroundColor: '#FCE3AD',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: vw(2),
  },
  txt: {
    fontSize: vw(3.8),
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },

  txt_count: {
    fontSize: vw(6),
    textAlign: 'center',
    fontWeight: 'bold',
    color: colors.text,
  },
});
