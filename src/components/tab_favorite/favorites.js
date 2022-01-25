import React, {PureComponent} from 'react';
import {View, FlatList, RefreshControl, StyleSheet} from 'react-native';
import {connect} from 'react-redux';

import ItemProfile from '../common/_profile';

import {AppContext} from '../../store/context';
import {fetchWorker, fetchEmployer, fetchFavIds} from '../../actions';

import {vw, vh} from '../../config/dimen';
import colors from '../../config/colors';

class App extends PureComponent {
  static contextType = AppContext;

  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    this.onRefresh();
  }

  onRefresh = () => {
    const {me} = this.context.state;
    if (me.kind) {
      this.props.fetchEmployer();
    } else {
      this.props.fetchWorker();
    }
    this.props.fetchFavIds();
  };

  render() {
    const {me} = this.context.state;
    const {workers, employers, fav_ids} = this.props.userReducer;

    let data = me.kind ? employers : workers;
    data = data.filter((d) => !d.blocked);

    return (
      <View style={styles.container}>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={this.onRefresh}
              tintColor="gray"
            />
          }
          data={data.filter((d) => fav_ids.indexOf(d.key) > -1)}
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
    fetchFavIds: () => dispatch(fetchFavIds()),
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
