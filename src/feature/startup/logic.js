import {createLogic}  from 'redux-logic';
import {Location,
        Permissions}  from 'expo';
import isString       from 'lodash.isstring';
import miniMeta       from './miniMeta';
import actions        from './actions';
import {toast}        from '../../util/notify';


/**
 * Monitor system bootstrap completion, starting our app's
 * authorization process.
 */
export const startApp = createLogic({

  name: `${miniMeta.name}.startApp`,
  type: String(actions.startup),
  
  process({getState, action, api}, dispatch, done) {
    // start our app - by kicking off resource retrievals needed by our app
    dispatch( actions.startup.loadFonts() );
    dispatch( actions.startup.locateDevice() );
    done();
  },

});


/**
 * Load our system fonts.
 */
export const loadFonts = createLogic({

  name: `${miniMeta.name}.loadFonts`,
  type: String(actions.startup.loadFonts),
  
  process({getState, action, api}, dispatch, done) {
    // asynchronously load our system resources
    api.system.loadResources()
       .then( () => {
         dispatch( actions.startup.loadFonts.complete() );
         done();
       })
       .catch( err => {
         dispatch( actions.startup.loadFonts.fail(err) );
         done();
       });
  },

});


/**
 * Geo locate our device.
 */
export const locateDevice = createLogic({

  name: `${miniMeta.name}.locateDevice`,
  type: String(actions.startup.locateDevice),
  warnTimeout: 0, // long-running logic (due to user interaction)
  
  process({getState, action, api}, dispatch, done) {

    // issue handler
    function handleIssue(msg, err=null) {

      // notify user of situation
      const myToast = err ? toast.error : toast.info;
      myToast({
        msg: `${msg}\nReverting to last know location.`,
      });

      // fallback to last known location (for now just hard-code to Glen Carbon)
      dispatch( actions.startup.locateDevice.complete({lat: 38.752209, lng: -89.986610}) );

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
                             dispatch( actions.startup.locateDevice.complete({lat: location.coords.latitude, 
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
 * Monitor Startup Progress
 */
export const monitorStartupProgress = createLogic({

  name: `${miniMeta.name}.monitorStartupProgress`,
  type: /startup.*.(complete|fail)/,
  
  process({getState, action, api}, dispatch, done) {

    const device    = miniMeta.getFeatureState(getState());
    let   statusMsg = null;

    // monitor the status of various system resources
    // ... fonts
    if (!device.fontsLoaded) {
      statusMsg = 'Waiting for Fonts to load';
    }
    else if (isString(device.fontsLoaded)) {
      statusMsg = device.fontsLoaded;
    }
    // ... device location
    else if (!device.loc) {
      statusMsg = 'Waiting for Device Location';
    }
    // ... system is READY!
    else {
      statusMsg = 'READY';
    }

    // update the system status
    dispatch( actions.startup.statusUpdate(statusMsg) );

    done();
  },

});



/**
 * Start app when system resources are available.
 */
export const startAppAuthProcess = createLogic({

  name: `${miniMeta.name}.startAppAuthProcess`,
  type: String(actions.startup.statusUpdate),
  
  process({getState, action, api}, dispatch, done) {

    // when system resources are available, 
    // start the app by kicking off our authorization process
    if (action.statusMsg === 'READY') {
      // ?? this has to be obtained from app cross-feature communication
      // dispatch( actions.auth.bootstrap() );
    }
    done();
  },

});

// promote all logic (accumulated in index.js)
// ... named exports (above) are used by unit tests :-)
export default [
  startApp,
  loadFonts,
  locateDevice,
  monitorStartupProgress,
  startAppAuthProcess,
];
