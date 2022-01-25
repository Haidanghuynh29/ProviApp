import React, {PureComponent} from 'react';
import {
  View,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import ItemProfile from '../common/_profile';
import SearchBox from './_search';

import * as API from '../../apis/api';
import {AppContext} from '../../store/context';
import {
  fetchWorker,
  fetchEmployer,
  fetchChat,
  fetchFavIds,
  fetchBlockingIds,
  fetchBlockedIds,
} from '../../actions';

import global from '../style';
import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';
import * as Moment from '../../config/moment';
import {PAY_KINDS} from '../../config/constant';

class App extends PureComponent {
  static contextType = AppContext;

  constructor(props, context) {
    super(props, context);

    const {params} = props.route;
    this.state = {
      visible: false,
      mode: params ? params.mode : 0,
    };
  }

  componentDidMount() {
    if (!this.state.mode) {
      this.props.navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity style={global.menu} onPress={this.onSearch}>
            <FontAwesome5 name={'search'} size={vw(5)} color={'white'} />
          </TouchableOpacity>
        ),
      });

      this.onRefresh();
    }
  }

  onRefresh = async () => {
    const {me} = this.context.state;
    if (me.kind) {
      this.props.fetchEmployer();
    } else {
      this.props.fetchWorker();
    }
    this.props.fetchChat(me.kind);
    this.props.fetchFavIds();
    this.props.fetchBlockingIds();
    this.props.fetchBlockedIds();
  };

  onSearch = () => this.setState({visible: !this.state.visible});

  render() {
    const {visible} = this.state;
    const {
      me,
      minAge,
      maxAge,
      minRate,
      maxRate,
      minHopeDays,
      maxHopeDays,
      prefecture,
      minProspectSales,
      maxProspectSales,
      minProspectDays,
      maxProspectDays,
      minPrice,
      maxPrice,
      priceType,
    } = this.context.state;
    const {workers, employers, blocking_ids, blocked_ids} =
      this.props.userReducer;

    var data = me.kind ? employers : workers;

    data = data.filter((d) => !blocked_ids.includes(d.key) && !d.blocked);
    if (this.state.mode) {
      data = data.filter((d) => blocking_ids.includes(d.key));
    } else {
      data = data.filter((d) => !blocking_ids.includes(d.key));
    }

    if (priceType) {
      const indexPriceType = PAY_KINDS.indexOf(priceType);
      if (indexPriceType > -1) {
        data = data.filter((d) => d.unit == indexPriceType + 1);
      }
    }

    if (me.kind) {
      if (prefecture) {
        data = data.filter((d) => [d.shop_prefecture].includes(prefecture));
      }
      if (maxPrice) {
        data = data.filter(
          (d) => d.min_pay >= minPrice && d.min_pay <= maxPrice,
        );
      }
    } else {
      if (prefecture) {
        data = data.filter((d) => [d.hope_prefecture].includes(prefecture));
      }
      if (maxAge) {
        data = data.filter((d) => {
          const age = Moment.getAge(d.birthday);
          return age >= minAge && age <= maxAge;
        });
      }
      if (maxRate) {
        data = data.filter(
          (d) => d.hope_pay >= minRate && d.hope_pay <= maxRate,
        );
      }
      if (maxHopeDays) {
        data = data.filter(
          (d) => d.hope_days >= minHopeDays && d.hope_days <= maxHopeDays,
        );
      }
      if (maxProspectSales) {
        data = data.filter(
          (d) =>
            d.prospect_sales >= minProspectSales &&
            d.prospect_sales <= maxProspectSales,
        );
      }
      if (maxProspectDays) {
        data = data.filter(
          (d) =>
            d.prospect_count >= minProspectDays &&
            d.prospect_count <= maxProspectDays,
        );
      }
    }

    return (
      <View style={styles.container}>
        <SearchBox visible={visible} onFinish={this.onSearch} />

        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={this.onRefresh}
              tintColor="gray"
            />
          }
          data={data}
          numColumns={2}
          initialNumToRender={10}
          columnWrapperStyle={styles.content}
          renderItem={({item, index}) => (
            <ItemProfile
              key={index}
              user={item}
              navigation={this.props.navigation}
            />
          )}
          keyExtractor={(_, index) => `${index}`}
          contentInset={{bottom: 30}}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    userReducer: state.userReducer,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    fetchWorker: () => dispatch(fetchWorker()),
    fetchEmployer: () => dispatch(fetchEmployer()),
    fetchChat: (kind, chats, chat) => dispatch(fetchChat(kind, chats, chat)),
    fetchFavIds: () => dispatch(fetchFavIds()),
    fetchBlockingIds: () => dispatch(fetchBlockingIds()),
    fetchBlockedIds: () => dispatch(fetchBlockedIds()),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    justifyContent: 'space-between',
    paddingTop: 15,
    marginHorizontal: vw(3),
  },
});
