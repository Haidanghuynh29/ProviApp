import {StyleSheet} from 'react-native';

import colors from '../config/colors';
import {vw, vh} from '../config/dimen';

const styles = StyleSheet.create({
  bebel: {
    shadowColor: 'black',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  dialog: {
    alignSelf: 'center',
    width: vw(85),
    paddingVertical: vh(2),
    paddingHorizontal: vw(5),
    backgroundColor: 'white',
    borderRadius: vw(3),
  },
  dlg_btn_content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: vh(3),
  },
  dlg_title: {
    fontSize: vw(4.5),
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    lineHeight: vw(5.5),
  },
  dlg_btn: {
    height: vw(10),
    borderRadius: vw(3),
    justifyContent: 'center',
  },
  dlg_btn_yes: {
    width: vw(36),
    backgroundColor: colors.brown,
  },
  dlg_btn_no: {
    width: vw(36),
    backgroundColor: 'lightgray',
  },
  dlg_btn_pink: {
    width: vw(36),
    backgroundColor: colors.pink,
  },
  dlg_btn_txt: {
    fontSize: vw(4),
    color: colors.text,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  menu: {
    paddingHorizontal: vw(4),
    paddingVertical: vw(1.5),
  },
});

export default styles;
