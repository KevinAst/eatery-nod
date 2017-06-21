import Expo             from 'expo';
import React            from 'react';
import {Provider}       from 'react-redux';
import createAppStore   from './src/startup/createAppStore';
import AppScreenRouter  from './src/comp/AppScreenRouter';


// create our top-level redux appStore
const appStore = createAppStore();

// wire up redux in our top-level root component
const rootComponent = () => <Provider store={appStore}>
                              <AppScreenRouter/>
                            </Provider>;

// launch our app
Expo.registerRootComponent(rootComponent);

// ?? TEMP: just for fun
appStore.dispatch({
  type: 'TEST_ACTION',
  payload: {
    one: 1,
    two: 2
  }
});
