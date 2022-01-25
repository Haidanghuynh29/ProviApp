import React, {PureComponent} from 'react';
import {View, Text, PermissionsAndroid, TouchableOpacity} from 'react-native';
import WifiManager from 'react-native-wifi-reborn';

import styles from '../style';
import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';

export default class App extends PureComponent {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    // const granted = await PermissionsAndroid.request(
    //   PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //   {
    //     title: 'Location permission is required for WiFi connections',
    //     message:
    //       'This app needs location permission as this is required  ' +
    //       'to scan for wifi networks.',
    //     buttonNegative: 'DENY',
    //     buttonPositive: 'ALLOW',
    //   },
    // );
    // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    // } else {
    //   // Permission denied
    // }
    WifiManager.getCurrentWifiSSID().then(
      (ssid) => {
        console.log('Your current connected wifi SSID is ' + ssid);
      },
      (e) => {
        console.log('Cannot get current SSID!', e);
      },
    );
  }

  connect = (kind) => () => {
    const data = [
      ['HUAWEI-FFF3', 'qazwsx12'],
      ['HUAWEI-E6A1', '461mj5ne'],
    ];

    WifiManager.connectToProtectedSSID(
      data[kind][0],
      data[kind][1],
      false,
    ).then(
      () => {
        console.log('Connected successfully!');
      },
      (e) => {
        console.log('Connection failed!', e);
      },
    );
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'gray', paddingTop: 100}}>
        <TouchableOpacity
          style={{
            padding: 20,
          }}
          onPress={this.connect(0)}>
          <Text>FFF3</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: 20,
          }}
          onPress={this.connect(1)}>
          <Text>E6A1</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
