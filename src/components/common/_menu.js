import React, {useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {AppContext} from '../../store/context';

import global from '../style';
import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';

export default ({navigation}) => {
  const context = useContext(AppContext);
  const {badgeAdmin} = context.state;

  return (
    <TouchableOpacity style={global.menu} onPress={navigation.openDrawer}>
      <FontAwesome5 name={'bars'} size={vw(5)} color={'white'} />
      {badgeAdmin == true && <View style={styles.badge} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: vw(2.5),
    top: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.red,
  },
});
