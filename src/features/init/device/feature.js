import React               from 'react';
import {createFeature}     from 'feature-u';
import featureName         from './featureName';
import platformSetup       from './misc/platformSetup';
import {createBootstrapFn} from '../../support/bootstrap/bootstrapFn';
import Notify              from '../../../util/notify';
import actions             from './actions';
import reducer,
       {isGuiReady,
        getDeviceLoc}      from './state';

// feature: device
//          initialize the device for use by the app (full details in README)
export default createFeature({
  name: featureName,

  reducer,

  // our public face ...
  fassets: {

    // various 'bootstrap.*' resources to initialize
    defineUse: {
      'bootstrap.fonts': createBootstrapFn('Waiting for Fonts to load',
                                           ({dispatch, fassets}) => {
                                             return fassets.deviceService.loadFonts()
                                                           .then( () => {
                                                             dispatch( actions.guiIsReady() );
                                                           })
                                           }),

      'bootstrap.location': createBootstrapFn('Waiting for Device Location',
                                              ({dispatch, fassets}) => {
                                                return fassets.deviceService.getCurPos()
                                                              .then( (location) => {
                                                                dispatch( actions.setLoc(location) );
                                                              })
                                                              .catch( (err) => {
                                                                // perform the fallback location ... Glen Carbon IL
                                                                dispatch( actions.setLoc({lat: 38.752209, lng: -89.986610}) );
                                              
                                                                // alter the error to be an expected condition (allowing the bootstrap to complete)
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
      'sel.isGuiReady':   isGuiReady,

                          // device location {lat, lng}
      'sel.getDeviceLoc': getDeviceLoc,

    }
  },

  appWillStart({fassets, curRootAppElm}) {
    // platform-specific setup (iOS/Android)
    platformSetup();

    // initialize our notify utility, by injecting it in our component tree root
    return [React.Children.toArray(curRootAppElm), <Notify key="Notify"/>];
  },

});
