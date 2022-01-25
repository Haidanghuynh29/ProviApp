import React, {PureComponent} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import Modal from 'react-native-modal';
import {Calendar} from 'react-native-calendars';

import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';
import * as Moment from '../../config/moment';

export default class App extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      date: null,
    };
  }

  render() {
    const {visible, setDate} = this.props;
    const {date} = this.state;
    const marked = {};
    if (date) {
      marked[date.dateString] = {selected: true};
    }

    return (
      <Modal isVisible={visible} animationType="fade">
        <View style={styles.fullStyle}>
          <View style={styles.flex}>
            <Button
              title="キャンセル"
              color={colors.salmon}
              onPress={setDate(null)}
            />
            <Button
              title="確認"
              onPress={setDate(date ? date.timestamp : null)}
            />
          </View>
          <Calendar
            // current={'2012-03-01'}
            markedDates={marked}
            minDate={'2020-01-01'}
            maxDate={'2100-01-01'}
            onDayPress={(day) => this.setState({date: day})}
            // onDayLongPress={(day) => {console.log('selected day', day)}}
            monthFormat={'yyyy年MM月'}
            // onMonthChange={(month) => {console.log('month changed', month)}}
            hideArrows={false}
            // renderArrow={(direction) => (<Arrow/>)}
            hideExtraDays={false}
            disableMonthChange={false}
            firstDay={7}
            hideDayNames={true}
            showWeekNumbers={false}
            onPressArrowLeft={(subtractMonth) => subtractMonth()}
            onPressArrowRight={(addMonth) => addMonth()}
            disableArrowLeft={false}
            disableArrowRight={false}
            disableAllTouchEventsForDisabledDays={true}
            // renderHeader={(date) => {/*Return JSX*/}}
          />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  fullStyle: {
    position: 'absolute',
    bottom: vw(-5),
    left: vw(-5),
    right: 0,
    width: vw(100),
    backgroundColor: 'white',
    paddingBottom: 30,
  },
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
  },
});
