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

/**
 * The **device** feature initializes the device for use by the app.
 *
 * In general, this initialization represents critical-path items that
 * must be completed before the app can run.
 *
 * It accomplishes the following:
 *
 *  - initiates the kickStart initialization process, by dispatching
 *    the device `kickStart()` action **(appDidStart)**.
 *
 *    - This process operates under the `'kickStart.*'` fassets use
 *      contract **(fassets.use, logic)**, and drives the following
 *      initialization:
 *      
 *      - `'kickStart.fonts'` ... loads the fonts required by the native-base GUI lib
 *      
 *      - `'kickStart.location'` ... initializes the device GPS location
 *      
 *    - The `setStatus(statusMsg)` action is emitted to reflect the
 *      overall kickStart status (e.g. 'Waiting for bla bla bla' -or-
 *      'READY').  This status can optionally be used (say by a
 *      SplashScreen) as user communication of what is going on.
 *      
 *    - The `ready()` action is emitted when all kickStart
 *      initialization has completed, and the app is fully initialized
 *      and ready to run.  This action is typically monitored by an
 *      external feature to start the app.
 *
 *  - performs device-specific initialization (iOS/Android) through
 *    the platformSetup() function **(appWillStart)**
 * 
 *  - injects the notify utility in the root DOM **(appWillStart)**
 *
 *  - disables downstream visuals until the device is ready -
 *    displaying a SplashScreen **(route)**
 *
 *
 * **State Transition**
 *
 * For a high-level overview of how actions, logic, and reducers interact
 * together to maintain this feature's state, please refer to
 * `docs/StateTransition.txt`.
 *
 *
 * **Screen Flow**
 *
 * You can see a Screen Flow diagram at: `docs/ScreenFlow.png`.
 */
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
