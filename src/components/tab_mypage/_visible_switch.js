import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { Switch } from 'react-native-switch';

import {vw, vh} from '../../config/dimen'
import colors from '../../config/colors';

export default function App (props) {
  const {visible, onChange} = props

  return (
    <View style={styles.container}>
      <Text style={styles.txt_a}>オーディションに参加する</Text>

      <Switch
        value={visible}
        onValueChange={(val) => onChange(val)}
        activeText={'オン'}
        inActiveText={'オフ'}
        circleSize={30}
        barHeight={36}
        circleBorderWidth={0}
        backgroundActive={colors.blue}
        backgroundInactive={'lightgray'}
        circleActiveColor={'white'}
        circleInActiveColor={'white'}
        renderActiveText={true}
        renderInActiveText={true}
        switchLeftPx={3}
        switchRightPx={3}
        switchWidthMultiplier={3}
        switchBorderRadius={30} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    height: 50,
    marginTop: vw(3),
  },
  txt_a: {
    color: colors.blue,
    fontSize: vw(4),
    fontWeight: 'bold',
    lineHeight: vw(5),
  },
})