import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';

export default ({label, value, onPicker}) => {
  const active = value != null;
  const lightGray = active ? colors.blue : 'lightgray';
  const textColor = active ? colors.blue : colors.text;

  return (
    <TouchableOpacity
      style={[styles.field, {borderColor: lightGray}]}
      onPress={onPicker(label)}>
      <Text style={[styles.field_value, {color: textColor}]}>{label}</Text>
      <Text style={[styles.field_value, {color: lightGray}]}>
        {value ?? '未定'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  field: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: vw(1),
    maxHeight: 44,
    paddingHorizontal: vw(3),
    marginBottom: vh(2),
  },
  field_value: {
    color: colors.text,
    fontSize: vw(3.5),
  },
});
