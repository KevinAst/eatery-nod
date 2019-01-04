import {createLogic}      from 'redux-logic';
import featureName        from './featureName';
import actions            from './actions';
import {isDeviceReady,
        areFontsLoaded,
        getFontsLoadedProblem,
        getDeviceLoc}     from './state';
import {toast}            from '../../util/notify';

/**
 * Load resources needed for our device.
 */
export const loadResources = createLogic({

  name: `${featureName}.loadResources`,
  type: String(actions.bootstrap),
  
  process({getState, action}, dispatch, done) {
    // start our app - by kicking off resource retrievals needed by our app
    dispatch( actions.loadFonts() );
    dispatch( actions.locateDevice() );
    done();
  },
});


/**
 * Load our system fonts.
 */
export const loadFonts = createLogic({

  name: `${featureName}.loadFonts`,
  type: String(actions.loadFonts),
  
  process({getState, action, fassets}, dispatch, done) {
    // asynchronously load our system resources
    fassets.device.api.loadFonts()
       .then( () => {
         dispatch( actions.loadFonts.complete() );
         done();
       })
       .catch( err => {
         dispatch( actions.loadFonts.fail(err) );
         done();
       });
  },

});


/**
 * Geo locate our device.
 */
export const locateDevice = createLogic({

  name: `${featureName}.locateDevice`,
  type: String(actions.locateDevice),
  warnTimeout: 0, // long-running logic (due to user interaction)
  
  process({getState, action, fassets}, dispatch, done) {

    // obtain our device location via our locationService
    fassets.locationService.getCurrentPositionAsync()

           .then( (location) => {
             dispatch( actions.locateDevice.complete(location) );
             done();
           })

           .catch( err => {

             // fallback to last known location (for now just hard-code to Glen Carbon)
             dispatch( actions.locateDevice.complete({lat: 38.752209, lng: -89.986610}) );

             // notify user and console log
             const msg = err.formatClientMsg() + ' ... falling back to last known location';
             toast.warn({msg});
             console.info(msg, err); // console.error is TOO intrusive in Expo env

             done();
           });

  },

});


/**
 * Monitor the device initialization progress, syncing the device status.
 */
export const monitorInitProgress = createLogic({

  name: `${featureName}.monitorInitProgress`,
  type: /device.*.(complete|fail)/,
  
  process({getState, action}, dispatch, done) {

    const appState           = getState();
    const fontsLoaded        = areFontsLoaded(appState);
    const fontsLoadedProblem = getFontsLoadedProblem(appState);
    const deviceLoc          = getDeviceLoc(appState);

    let   statusMsg = null;

    // monitor the status of various system resources
    // ... fonts
    if (!fontsLoaded) {
      statusMsg = 'Waiting for Fonts to load';
    }
    else if (fontsLoadedProblem) { // expose any problem in loading fonts
      statusMsg = fontsLoadedProblem;
    }
    // ... device location
    else if (!deviceLoc) {
      statusMsg = 'Waiting for Device Location';
    }
    // ... system is READY!
    else {
      statusMsg = 'READY';
    }

    // update the system status
    dispatch( actions.statusUpdate(statusMsg) );

    done();
  },

});


/**
 * Monitor device status, emitting a ready action when appropriate.
 */
export const monitorDeviceReadiness = createLogic({

  name: `${featureName}.monitorDeviceReadiness`,
  type: String(actions.statusUpdate),
  
  process({getState, action, fassets}, dispatch, done) {

    // when our device is ready, kick off our authorization process
    if ( isDeviceReady(getState()) ) {
      dispatch( actions.ready() );
    }
    done();
  },

});


// promote all logic modules for this feature
// ... NOTE: individual logic modules are unit tested using the named exports.
export default [
  loadResources,
  loadFonts,
  locateDevice,
  monitorInitProgress,
  monitorDeviceReadiness,
];
