import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import SegmentedPicker from 'react-native-segmented-picker';
import RNPickerSelect from 'react-native-picker-select';
import CalendarPicker from '../common/datepicker';

import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';
import {PREFECTURES} from '../../config/constant';
import * as Helper from '../../config/helper';

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };

    if (props.kind > 2) {
      this.segmentedPicker = React.createRef();
    }
  }

  setDate = (flag, date) => {
    const {txtA, onChange} = this.props;
    if (flag) {
      onChange(txtA, date.getTime());
    }
    this.setState({visible: false});
  };
  onPress = () => {
    if (this.props.kind == 2) {
      this.setState({visible: !this.state.visible});
    } else {
      this.segmentedPicker.current.show();
    }
  };
  onPick = (selections) => {
    const {txtA, onChange} = this.props;
    onChange(txtA, selections.a);
  };

  render() {
    const {visible} = this.state;
    const {txtA, txtB, onChange, kind, must, unit} = this.props;
    var options = [];
    if (kind > 2) {
      options = Helper.pickerOptions(kind + 1);
    }

    return (
      <View style={styles.container}>
        <Text style={styles.txt_a}>
          {txtA}
          {must && <Text style={styles.must}>(必須)</Text>}
        </Text>
        {kind >= 2 ? (
          <Text style={styles.txt_b} onPress={this.onPress}>
            {txtB}
          </Text>
        ) : (
          <View>
            {unit > 0 && (
              <RNPickerSelect
                value={unit}
                style={pickerStyle}
                doneText="OK"
                placeholder={{label: '時給', value: 1}}
                placeholderTextColor="red"
                onValueChange={(value) => onChange('単位', value)}
                items={[
                  {label: '日給', value: 2},
                  {label: '月給', value: 3},
                ]}
              />
            )}
            <TextInput
              value={txtB ? txtB.toString() : null}
              style={styles.txt_b}
              keyboardType={kind ? 'number-pad' : 'default'}
              onChangeText={(text) => onChange(txtA, text)}
            />
          </View>
        )}
        {visible && <CalendarPicker setDate={this.setDate} />}
        {kind > 2 && (
          <SegmentedPicker
            ref={this.segmentedPicker}
            onConfirm={this.onPick}
            confirmText="確認"
            options={options}
          />
        )}
      </View>
    );
  }
}

const pickerStyle = StyleSheet.create({
  inputIOS: {
    fontSize: vw(3.5),
    color: colors.text,
    width: vw(55),
    borderWidth: 1,
    borderRadius: vw(2),
    borderColor: 'lightgray',
    paddingVertical: vh(1.2),
    paddingHorizontal: vw(2),
  },
  inputAndroid: {
    fontSize: vw(3.5),
    color: colors.text,
    width: vw(55),
    borderWidth: 1,
    borderRadius: vw(2),
    borderColor: 'lightgray',
    paddingVertical: vh(1.2),
    paddingHorizontal: vw(2),
  },
  placeholder: {
    color: colors.text,
  },
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    paddingVertical: 5,
  },
  txt_a: {
    fontSize: vw(3.5),
    lineHeight: vw(4),
    color: colors.text,
  },
  must: {
    fontSize: vw(3),
    color: colors.pink,
  },
  txt_b: {
    fontSize: vw(3.5),
    color: colors.text,
    width: vw(55),
    borderWidth: 1,
    borderRadius: vw(2),
    borderColor: 'lightgray',
    paddingVertical: vh(1.2),
    paddingHorizontal: vw(2),
  },
});
