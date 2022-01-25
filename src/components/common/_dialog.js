import * as React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';

import global from '../style';
import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';

export default class App extends React.PureComponent {
  render() {
    const {visible, text, onClick} = this.props;

    return (
      <Modal isVisible={visible}>
        <View style={global.dialog}>
          <Text style={global.dlg_title}>{text}</Text>

          <View style={global.dlg_btn_content}>
            <TouchableOpacity
              style={[global.dlg_btn, global.dlg_btn_no]}
              onPress={onClick(false)}>
              <Text style={global.dlg_btn_txt}>いいえ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[global.dlg_btn, global.dlg_btn_yes]}
              onPress={onClick(true)}>
              <Text style={global.dlg_btn_txt}>はい</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}
