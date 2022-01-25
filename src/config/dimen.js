import {Dimensions} from 'react-native'

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

export const vw = (value) => {
  return SCREEN_WIDTH / 100 * value
}

export const vh = (value) => {
  return SCREEN_HEIGHT / 100 * value
}