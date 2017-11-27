import {createLogic}      from 'redux-logic';
import {Location,
        Permissions}      from 'expo';
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
  
  process({getState, action, app}, dispatch, done) {
    // asynchronously load our system resources
    app.device.api.loadFonts()
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
  
  process({getState, action}, dispatch, done) {

    // issue handler
    function handleIssue(msg, err=null) {

      // notify user of situation
      const myToast = err ? toast.error : toast.info;
      myToast({
        msg: `${msg}\nReverting to last know location.`,
      });

      // fallback to last known location (for now just hard-code to Glen Carbon)
      dispatch( actions.locateDevice.complete({lat: 38.752209, lng: -89.986610}) );

      // log any error
      if (err) {
        console.error(msg, err);
      }

      // complete this logic service
      done();
    }

    // obtain permission: device geo location
    // ... will auto-succeed if access has previously been granted/failed (when "don't ask again" checked)
    Permissions.askAsync(Permissions.LOCATION)
               .then( ({status}) => {
                 if (status === 'granted') {
                   // obtain device geo location
                   Location.getCurrentPositionAsync({})
                           .then( (location) => {
                             // console.log(`xx Obtained Device Location: `, location);
                             // Obtained Device Location: {
                             //   "coords": {
                             //     "accuracy":   50,
                             //     "altitude":   0,
                             //     "heading":    0,
                             //     "latitude":   38.7657446, // of interest
                             //     "longitude": -89.9923039, // of interest
                             //     "speed":      0,
                             //   },
                             //   "mocked":    false,
                             //   "timestamp": 1507050033634,
                             // }

                             // communicate device location
                             dispatch( actions.locateDevice.complete({lat: location.coords.latitude, 
                                                                      lng: location.coords.longitude}) );
                           })
                           .catch( err => {
                             handleIssue('Could not obtain device location.', err);
                           });
                 }
                 else {
                   // permission denied
                   handleIssue('No access to device location.');
                 }
               })
               .catch( err => {
                 handleIssue('An issue was encountered in obtaining device location permission.', err);
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
  
  process({getState, action, app}, dispatch, done) {

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
