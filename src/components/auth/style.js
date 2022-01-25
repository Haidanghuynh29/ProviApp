import {StyleSheet} from 'react-native';

import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: vh(10),
  },
  txt_logo: {
    color: 'white',
    fontSize: vw(8),
    lineHeight: vw(10),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  txt_bigger: {
    fontSize: vw(12),
    lineHeight: vw(15),
    letterSpacing: vw(0.5),
  },
  img_title: {
    alignSelf: 'center',
    width: vw(30),
    height: undefined,
    aspectRatio: 1 / 1,
  },
  content: {
    marginHorizontal: vw(15),
    marginTop: vh(5),
  },
  txt_input: {
    fontSize: vw(4.5),
    fontWeight: 'bold',
    color: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    lineHeight: vw(5),
    paddingVertical: 0,
    paddingBottom: vw(1),
    marginBottom: vh(3),
  },
  btn: {
    borderRadius: vw(2),
    backgroundColor: colors.brown,
    height: 44,
    justifyContent: 'center',
  },
  txt_btn: {
    color: 'white',
    fontSize: vw(4.5),
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default styles;
