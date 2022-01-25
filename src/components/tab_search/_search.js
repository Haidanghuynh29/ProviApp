import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SegmentedPicker from 'react-native-segmented-picker';

import Item from './_item_search';

import {AppContext, SET_SEARCH} from '../../store/context';

import global from '../style';
import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';
import * as Helper from '../../config/helper';

export const STRS_WORKER = [
  '年齢',
  '日給/時給',
  '希望給料',
  '希望勤務日数（週）',
  '希望勤務地',
  '見込売上(円/月)',
  '見込組数(組/月)',
];

export const STRS_EMPLOYER = ['勤務地', '日給/時給', '最低給料'];

export default class App extends React.PureComponent {
  static contextType = AppContext;

  get initialState() {
    return {
      pickerKind: -1,
      minAge: null,
      maxAge: null,
      minRate: null,
      maxRate: null,
      minHopeDays: null,
      maxHopeDays: null,
      prefecture: null,
      minProspectSales: null,
      maxProspectSales: null,
      minProspectDays: null,
      maxProspectDays: null,

      minPrice: null,
      maxPrice: null,
      priceType: null,
    };
  }

  constructor(props) {
    super(props);

    this.state = this.initialState;

    this.segmentedPicker = React.createRef();
  }

  onPicker = (label) => () => {
    const {me} = this.context.state;
    const STRS = me.kind ? STRS_EMPLOYER : STRS_WORKER;
    const kind = STRS.indexOf(label) + (me.kind ? STRS_WORKER.length : 0);
    this.setState({pickerKind: kind});
    this.segmentedPicker.current.show();
  };
  onConfirm = (value) => {
    switch (this.state.pickerKind) {
      case 0:
        this.setState({minAge: value.a, maxAge: value.b});
        break;
      case 1:
      case 8:
        this.setState({priceType: value.a});
        break;
      case 2:
        this.setState({minRate: value.a, maxRate: value.b});
        break;
      case 3:
        this.setState({minHopeDays: value.a, maxHopeDays: value.b});
        break;
      case 4:
      case 7:
        this.setState({prefecture: value.a});
        break;
      case 5:
        this.setState({minProspectSales: value.a, maxProspectSales: value.b});
        break;
      case 6:
        this.setState({minProspectDays: value.a, maxProspectDays: value.b});
        break;
      case 9:
        this.setState({minPrice: value.a, maxPrice: value.b});
        break;
    }
  };
  onSubmit = (flag) => () => {
    if (flag) {
      this.context.dispatch({
        ...this.state,
        type: SET_SEARCH,
      });
      this.props.onFinish();
    } else {
      this.setState(this.initialState);
    }
  };

  render() {
    const {me} = this.context.state;
    const {visible} = this.props;
    const {
      pickerKind,
      minAge,
      maxAge,
      minRate,
      maxRate,
      minHopeDays,
      maxHopeDays,
      prefecture,
      minProspectSales,
      maxProspectSales,
      minProspectDays,
      maxProspectDays,
      minPrice,
      maxPrice,
      priceType,
    } = this.state;

    var values = [];
    var options = Helper.pickerOptions(pickerKind);
    const STRS = me.kind ? STRS_EMPLOYER : STRS_WORKER;

    if (me.kind) {
      values = [
        prefecture,
        priceType,
        maxPrice ? `${minPrice} ~ ${maxPrice}円` : null,
      ];
    } else {
      values = [
        minAge ? `${minAge} ~ ${maxAge}才` : null,
        priceType,
        maxRate
          ? `${Helper.number_delimiter(minRate)} ~ ${Helper.number_delimiter(
              maxRate,
            )}円`
          : null,
        maxHopeDays ? `${minHopeDays} ~ ${maxHopeDays}日` : null,
        prefecture,
        maxProspectSales
          ? `${Helper.number_delimiter(
              minProspectSales,
            )} ~ ${Helper.number_delimiter(maxProspectSales)}円`
          : null,
        maxProspectDays
          ? `${minProspectDays} ~ ${
              maxProspectDays <= 100 ? maxProspectDays + '組' : '100組以上'
            }`
          : null,
      ];
    }

    return (
      <Modal isVisible={visible}>
        <View style={styles.dialog}>
          <TouchableOpacity
            style={styles.btn_close}
            onPress={this.props.onFinish}>
            <FontAwesome5 name={'times'} size={vw(5)} color={'white'} />
          </TouchableOpacity>

          <ScrollView contentContainerStyle={styles.content}>
            {STRS.map((str, index) => (
              <Item
                key={index}
                label={str}
                value={values[index]}
                onPicker={this.onPicker}
              />
            ))}
          </ScrollView>

          <View style={global.dlg_btn_content}>
            <TouchableOpacity
              style={[global.dlg_btn, global.dlg_btn_no]}
              onPress={this.onSubmit(false)}>
              <Text style={[global.dlg_btn_txt]}>リセット</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[global.dlg_btn, global.dlg_btn_pink]}
              onPress={this.onSubmit(true)}>
              <Text style={[global.dlg_btn_txt, {color: 'white'}]}>検索</Text>
            </TouchableOpacity>
          </View>

          <SegmentedPicker
            ref={this.segmentedPicker}
            onConfirm={this.onConfirm}
            confirmText="確認"
            options={options}
          />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  dialog: {
    flex: 0.8,
    alignSelf: 'center',
    width: vw(90),
    height: undefined,
    backgroundColor: 'white',
    borderRadius: vw(3),
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: vw(3.5),
  },
  btn_close: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 35,
    height: 35,
    borderRadius: 35,
    backgroundColor: '#333333aa',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  content: {
    flex: 1,
  },
});
