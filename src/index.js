import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';

import Root from './components';
import {StateProvider} from './store/context';
import configureStore from './store/store';

const store = configureStore();

export default class App extends React.PureComponent {
  render() {
    return (
      <Provider store={store}>
        <StateProvider>
          <NavigationContainer>
            <Root />
          </NavigationContainer>
        </StateProvider>
      </Provider>
    );
  }
}
