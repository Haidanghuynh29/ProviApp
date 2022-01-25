import * as React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';

export default class Indicator extends React.PureComponent {
  render() {
    return (
      <Modal isVisible={this.props.visible} animationType="none">
        <View style={styles.container}>
          <ActivityIndicator size="large" color="white" />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: 120,
    height: 120,
    borderRadius: 20,
    backgroundColor: '#22222277',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
