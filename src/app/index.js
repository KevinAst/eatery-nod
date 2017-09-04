import Expo             from 'expo';
import React            from 'react';
import {Provider}       from 'react-redux';
import {Drawer}         from 'native-base';
import platformSetup    from './startup/platformSetup';
import initFireBase     from './startup/firebase/initFireBase';
import createAppStore   from './startup/createAppStore';
import SideBar, 
       {registerDrawer,
        closeSideBar}   from './SideBar';
import ScreenRouter     from './ScreenRouter';
import actions          from '../actions';

//***
//*** main entry point for our entire app :-)
//***

// platform-specific setup (iOS/Android)
platformSetup();

// Initialize FireBase
initFireBase();

// create our top-level redux appStore and register our redux-logic
const appStore = createAppStore();

// register our appRootComp to Expo, wiring up redux, and our left-nav sidebar
const appRootComp = () => (
  <Provider store={appStore}>
    <Drawer ref={ ref => registerDrawer(ref) }
            content={<SideBar/>}
            onClose={closeSideBar}>
      <ScreenRouter/>
    </Drawer>
  </Provider>);
Expo.registerRootComponent(appRootComp);

// bootstrap our app processes (a swift kick to get the ball rolling)
appStore.dispatch( actions.system.bootstrap() );
