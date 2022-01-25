import React, {PureComponent} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import _ from 'lodash';
import FastImage from 'react-native-fast-image';
import RNIap, {
  Product,
  ProductPurchase,
  PurchaseError,
  acknowledgePurchaseAndroid,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';

import Indicator from '../common/indicator';
import DialogBuy from '../common/_dialog';

import {AppContext, SET_POINT} from '../../store/context';
import * as API from '../../apis/api';

import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';
import * as Helper from '../../config/helper';

import {PRICES} from '../../config/constant';

const IMGS = [
  require('../../../assets/images/pt_1000.png'),
  require('../../../assets/images/pt_2000.png'),
  require('../../../assets/images/pt_3000.png'),
  require('../../../assets/images/pt_4000.png'),
  require('../../../assets/images/pt_5000.png'),
  require('../../../assets/images/pt_6000.png'),
  require('../../../assets/images/pt_7000.png'),
  require('../../../assets/images/pt_8000.png'),
  require('../../../assets/images/pt_9000.png'),
  require('../../../assets/images/pt_10000.png'),
];

const SKUS = _.range(10).map((i, _) => `com.jp.provi${i + 1}`);
const ITEM_SKUS = Platform.select({
  ios: SKUS,
  android: SKUS,
});

let purchaseUpdateSubscription;
let purchaseErrorSubscription;

export default class App extends PureComponent {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      loading: true,
      iNdex: -1,
      productList: [],
      receipt: '',
      availableItemsMessage: '',
    };
  }

  async componentDidMount() {
    try {
      const result = await RNIap.initConnection();
      const products = await RNIap.getProducts(ITEM_SKUS);
      // await RNIap.consumeAllItemsAndroid();

      this.setState({productList: products, loading: false});
    } catch (err) {
      console.log('error in cdm => ', err);
    }
    purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
      console.log('purchaseUpdatedListener', purchase);
      if (
        purchase.purchaseStateAndroid === 1 &&
        !purchase.isAcknowledgedAndroid
      ) {
        try {
          const ackResult = await acknowledgePurchaseAndroid(
            purchase.purchaseToken,
          );
          console.log('ackResult', ackResult);
        } catch (ackErr) {
          console.warn('ackErr', ackErr);
        }
      }
      this.purchaseConfirmed();
      this.setState({receipt: purchase.transactionReceipt});
      purchaseErrorSubscription = purchaseErrorListener((error) => {
        console.log('purchaseErrorListener', error);
        // alert('purchase error', JSON.stringify(error));
      });
    });
  }
  componentWillUnmount() {
    if (purchaseUpdateSubscription) {
      purchaseUpdateSubscription.remove();
      purchaseUpdateSubscription = null;
    }
    if (purchaseErrorSubscription) {
      purchaseErrorSubscription.remove();
      purchaseErrorSubscription = null;
    }
  }
  getItems = async () => {
    try {
      this.requestPurchase(ITEM_SKUS[0]);
    } catch (err) {
      console.log('getItems || purchase error => ', err);
    }
  };
  getSubscriptions = async () => {
    try {
      const products = await RNIap.getSubscriptions(ITEM_SKUS);
      console.log('Products => ', products);
      this.setState({productList: products});
    } catch (err) {
      console.log('getSubscriptions error => ', err);
    }
  };
  getAvailablePurchases = async () => {
    try {
      const purchases = await RNIap.getAvailablePurchases();
      console.info('Available purchases => ', purchases);
      if (purchases && purchases.length > 0) {
        this.setState({
          availableItemsMessage: `Got ${purchases.length} items.`,
          receipt: purchases[0].transactionReceipt,
        });
      }
    } catch (err) {
      console.warn(err.code, err.message);
      console.log('getAvailablePurchases error => ', err);
    }
  };
  requestPurchase = async () => {
    const {iNdex} = this.state;
    const {point} = this.context.state;

    try {
      await RNIap.requestPurchase(SKUS[iNdex]);
      this.context.dispatch({
        type: SET_POINT,
        point: point + PRICES[iNdex],
      });
      API.update_point(point + PRICES[iNdex]);
    } catch (err) {
      console.log('requestPurchase error => ', err);
    }
  };
  requestSubscription = async (sku) => {
    try {
      await this.getItems();
      await RNIap.requestSubscription(sku);
    } catch (err) {
      alert(err.toLocaleString());
    }
  };
  purchaseConfirmed = () => {
    //you can code here for what changes you want to do in db on purchase successfull
  };

  onItem = (index) => () => {
    this.setState({visible: true, iNdex: index});
  };
  onClick = (flag) => () => {
    this.setState({visible: false});
    if (flag) {
      this.requestPurchase();
    }
  };

  render() {
    const {loading, visible, iNdex} = this.state;

    return (
      <View style={styles.container}>
        <Indicator visible={loading} />
        {visible && (
          <DialogBuy
            visible={visible}
            onClick={this.onClick}
            text={`${Helper.number_delimiter(
              PRICES[iNdex],
            )}円分 / ポイント${'\n'}購入しましょうか？`}
          />
        )}
        <Text style={styles.txt_title}>
          残りポイント：{Helper.number_delimiter(this.context.state.point)}
          <Text style={[styles.txt_title, {color: colors.pink}]} />
        </Text>

        <FlatList
          data={IMGS}
          numColumns={2}
          initialNumToRender={10}
          columnWrapperStyle={styles.content}
          renderItem={({item, index}) => (
            <TouchableOpacity key={index} onPress={this.onItem(index)}>
              <FastImage style={styles.img} source={item} />
            </TouchableOpacity>
          )}
          keyExtractor={(_, index) => `${index}`}
          contentInset={{bottom: 30}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    padding: vw(3),
  },
  content: {
    marginBottom: vh(2),
    justifyContent: 'space-around',
  },
  txt_title: {
    color: colors.blue,
    fontSize: vw(4),
    fontWeight: 'bold',
    lineHeight: vw(5),
    marginBottom: vw(3),
  },
  img: {
    width: vw(36),
    height: undefined,
    aspectRatio: 16 / 9,
  },
});
