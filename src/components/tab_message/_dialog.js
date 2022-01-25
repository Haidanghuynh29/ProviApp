import * as React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {AppContext} from '../../store/context';

import global from '../style';
import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';

export default class App extends React.PureComponent {
  static contextType = AppContext;

  render() {
    const {me} = this.context.state;
    const {visible, onClick} = this.props;

    return (
      <Modal isVisible={visible}>
        <View style={global.dialog}>
          <TouchableOpacity style={styles.btn_close} onPress={onClick(0)}>
            <FontAwesome5 name={'times'} size={vw(5)} color={'white'} />
          </TouchableOpacity>

          {me.kind ? (
            <TouchableOpacity style={styles.btn_gray} onPress={onClick(3)}>
              <Text style={[global.dlg_btn_txt]}>面接キャンセル</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity style={styles.btn_pink} onPress={onClick(5)}>
                <Text style={[global.dlg_btn_txt, {color: 'white'}]}>採用</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn_brown} onPress={onClick(4)}>
                <Text style={global.dlg_btn_txt}>不採用</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  btn_close: {
    position: 'absolute',
    top: vw(2),
    right: vw(2),
    width: vw(8),
    height: vw(8),
    borderRadius: vw(4),
    backgroundColor: '#333333aa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn_pink: {
    ...global.dlg_btn,
    ...global.dlg_btn_pink,
    width: '100%',
    marginTop: vh(7),
  },
  btn_brown: {
    ...global.dlg_btn,
    ...global.dlg_btn_yes,
    width: '100%',
    marginTop: vh(2),
  },
  btn_gray: {
    ...global.dlg_btn,
    ...global.dlg_btn_no,
    width: '100%',
    marginTop: vh(7),
  },
});
