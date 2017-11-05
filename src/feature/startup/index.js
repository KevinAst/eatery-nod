import React            from 'react';
import {createFeature,
        injectContext,
        shapedReducer}  from '../../util/feature-u';
import reducer          from './reducer';
import logic            from './logic';
import router           from './router';
import actions          from './actions';
import platformSetup    from './init/platformSetup';
import initFireBase     from './init/firebase/initFireBase';
import Notify           from '../../util/notify'; 


/**
 * The 'startup' feature bootstraps the entire app, getting it up-and-running.
 *
 * For this feature's public API, please see crossFeature (below), 
 * promoted through app.startup.
 */
export default createFeature({

  name:     'startup',
  reducer:  shapedReducer(reducer, 'device'),

  crossFeature: injectContext( (feature) => ({
    selectors: {
      fontsLoaded: (appState) => feature.reducer.getShapedState(appState).fontsLoaded === true, // NOTE: fontsLoaded true check IS REQUIRED, as it can also contain error string
      deviceReady: (appState) => feature.reducer.getShapedState(appState).status === 'READY',
    },
  }) ),

  logic,
  router,

  appWillStart(app, children) {
    // platform-specific setup (iOS/Android)
    platformSetup();

    // initialize FireBase
    initFireBase();

    // initialize notify utility, by injecting it to our App root
    return [React.Children.toArray(children), <Notify key="Notify"/>];
  },

  appDidStart({app, appState, dispatch}) {
    // bootstrap our app processes (a swift kick to get the ball rolling)
    dispatch( actions.startup() );
  },

});
