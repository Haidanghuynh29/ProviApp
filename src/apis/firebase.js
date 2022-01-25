import messaging from '@react-native-firebase/messaging';
import * as API from './api';

export default class Firebase {
  static async firebaseConfig() {
    // messaging().onMessage((remoteMessage) =>
    //   console.log('onMessage ', JSON.stringify(remoteMessage)),
    // );
    // messaging().setBackgroundMessageHandler((remoteMessage) =>
    //   console.log('setBackgroundMessageHandler ', remoteMessage),
    // );
    // messaging().onNotificationOpenedApp((remoteMessage) =>
    //   console.log('onNotificationOpenedApp ', remoteMessage.notification),
    // );
    // messaging()
    //   .getInitialNotification()
    //   .then((remoteMessage) =>
    //     console.log('getInitialNotification ', remoteMessage),
    //   );
  }
  static async checkPermission() {
    // // if (!messaging().isDeviceRegisteredForRemoteMessages) {
    // await messaging().registerDeviceForRemoteMessages();
    // // }

    const enabled = await messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
    messaging().onTokenRefresh((fcmToken) => this.getToken(fcmToken));
  }
  static async requestPermission() {
    try {
      await messaging().requestPermission();
    } catch (error) {
      console.log('permission rejected');
    }
  }
  static async getToken(token = null) {
    var fcmToken = token;
    if (!token) {
      fcmToken = await messaging().getToken();
    }
    API.update_token(fcmToken);
  }
}
