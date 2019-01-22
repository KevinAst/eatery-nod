import React               from 'react';
import {createFeature}     from 'feature-u';
import featureName         from './featureName';
import platformSetup       from './misc/platformSetup';
import {createKickStart,
        isFassetKickStart} from './misc/kickStart';
import Notify              from '../../../util/notify';
import actions             from './actions';
import logic               from './logic';
import route               from './route';
import reducer,
       {isGuiReady,
        getDeviceLoc}      from './state';

// feature: device
//          initialize the device for use by the app (full details in README)
export default createFeature({
  name: featureName,

  reducer,
  logic,
  route,

  // our public face ...
  fassets: {

    // the 'kickStart.*' use contract (see 'kickStart' logic module)
    use: [
      ['kickStart.*', {required: false, type: isFassetKickStart}],
    ],

    // various 'kickStart.*' resources to initialize (can be in other features too)
    defineUse: {
      'kickStart.fonts': createKickStart('Waiting for Fonts to load',
                                         ({dispatch, fassets}) => {
                                           return fassets.deviceService.loadFonts()
                                                         .then( () => {
                                                           dispatch( actions.guiIsReady() );
                                                         })
                                         }),

      'kickStart.location': createKickStart('Waiting for Device Location',
                                            ({dispatch, fassets}) => {
                                              return fassets.deviceService.getCurPos()
                                                            .then( (location) => {
                                                              dispatch( actions.setLoc(location) );
                                                            })
                                                            .catch( (err) => {
                                                              // perform the fallback location ... Glen Carbon IL
                                                              dispatch( actions.setLoc({lat: 38.752209, lng: -89.986610}) );

                                                              // alter the error to be an expected condition (allowing the kickStart to complete)
                                                              throw err.defineUserMsg('A problem was encountered accessing GPS Location\n... falling back to our base location (Glen Carbon, IL)');
                                                            })

                                            }),
    },

    // various public "push" resources
    define: {

      //*** public selectors ***
                                           // Can FULL GUI be used (e.g. native-base components)?
                                           // Needed by a limited few GUI components (that render EARLY), 
                                           // driving a "more primitive content" fallback when GUI is NOT yet initialized
                                           // ... see: state.js description
      [`${featureName}.sel.isGuiReady`]:   isGuiReady,

                                           // device location {lat, lng}
      [`${featureName}.sel.getDeviceLoc`]: getDeviceLoc,

      //*** public actions ***
                                           // the fundamental action, 
                                           // monitored by down-stream features (e.g. authorization),
                                           // logically starting our app running!
      [`${featureName}.actions.ready`]:    actions.ready,

    }
  },

  appWillStart({fassets, curRootAppElm}) {
    // platform-specific setup (iOS/Android)
    platformSetup();

    // initialize our notify utility, by injecting it in our component tree root
    return [React.Children.toArray(curRootAppElm), <Notify key="Notify"/>];
  },

  appDidStart({fassets, appState, dispatch}) {
    // dispatch the kickStart action, that "kicks off" the entire app, by starting our device initialization process
    dispatch( actions.kickStart() );
  }

});
