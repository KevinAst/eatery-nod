import React            from 'react';
import {createFeature,
        shapedReducer}  from '../../common/util/feature-u';
import reducer          from './reducer';
import logic            from './logic';
import router           from './router';
import platformSetup    from './init/platformSetup';
import initFireBase     from './init/firebase/initFireBase';
import actions          from './actions';
import Notify           from '../../common/util/notify'; 

/**
 * The 'startup' feature bootstraps the entire app, getting it up-and-running.
 *
 * For this feature's public API, please see crossFeature (below), 
 * promoted through app.startup.
 */
export default createFeature({

  name:       'startup',
  reducer:    shapedReducer(reducer, 'device'),
  logic,
  router,

  crossFeature: {
    selectors: {
      fontsLoaded: (appState) => appState.device.fontsLoaded === true, // NOTE: can also contain error string, so true check is required
      deviceReady: (appState) => appState.device.status === 'READY',
    },
  },

  appWillStart(app, children) {
    // platform-specific setup (iOS/Android)
    platformSetup();

    // initialize FireBase
    initFireBase();

    // initialize notify utility, by injecting it to our App root
    return [React.Children.toArray(children), <Notify/>];
  },

  appDidStart({app, appState, dispatch}) {
    // bootstrap our app processes (a swift kick to get the ball rolling)
    dispatch( actions.system.bootstrap() );
  },

});
