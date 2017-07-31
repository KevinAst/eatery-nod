import Expo             from 'expo';
import React            from 'react';
import {Provider}       from 'react-redux';
import platformSetup    from './src/startup/platformSetup';
import initFireBase     from './src/startup/firebase/initFireBase';
import createAppStore   from './src/startup/createAppStore';
import AppRouter        from './src/AppRouter';
import actions          from './src/actions';

// platform-specific setup (iOS/Android)
platformSetup();

// Initialize FireBase
initFireBase();

// create our top-level redux appStore and register our redux-logic
const appStore = createAppStore();

// register our app to Expo (wiring up redux)
const appComp = () => <Provider store={appStore}>
                        <AppRouter/>
                      </Provider>;
Expo.registerRootComponent(appComp);

// bootstrap our app processes (a swift kick to get the ball rolling)
appStore.dispatch( actions.system.bootstrap() );
