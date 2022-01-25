import React, {PureComponent} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
} from 'react-native'
import Modal from 'react-native-modal';
import DatePicker from 'react-native-date-picker'

import {vw, vh} from '../../config/dimen'
import colors from '../../config/colors';

export default class App extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      temp: new Date()
    }
  }

  setDate = (flag) => () => {
    this.props.setDate(flag, this.state.temp)
  }

  render() {
    const { temp } = this.state

    return (
      <Modal
        isVisible={true}
        animationType="none" >
        <View style={styles.container}>
          <View
            style={styles.fullStyle}>
            <View style={styles.content}>
              <Button
                title="キャンセル"
                color={colors.pink}
                onPress={this.setDate(false)} />
              <Button
                title="確認"
                onPress={this.setDate(true)} />
            </View>
            <DatePicker
              mode={'date'}
              date={temp}
              locale={'ja'}
              fadeToColor='#000'
              onDateChange={date => this.setState({temp: date})} />
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: vw(5),
    marginTop: vh(1),
  },
  fullStyle: {
    position: "absolute",
    bottom: vw(-5),
    left: vw(-5),
    right: 0,
    width: vw(100),
    backgroundColor: 'white',
    alignItems: 'center',
  },
})
