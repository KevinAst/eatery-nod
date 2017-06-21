import Expo            from 'expo';
import React           from 'react';
import {Provider}      from 'react-redux';
import createAppStore  from './src/startup/createAppStore';
import App             from './src/comp/App';


// create our top-level redux appStore
const appStore = createAppStore();

// wire up redux in our top-level root component
const rootComponent = <Provider store={appStore}>
                        <App/>
                      </Provider>;

// run our app
Expo.registerRootComponent(App);

// ?? just for fun
appStore.dispatch({
  type: 'TEST_ACTION',
  payload: {
    one: 1,
    two: 2
  }
});
