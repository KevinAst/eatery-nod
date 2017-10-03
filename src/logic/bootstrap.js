import {createLogic}  from 'redux-logic';
import {Location,
        Permissions}  from 'expo';
import isString       from 'lodash.isstring';
import actions        from '../actions';
import {toast}        from '../util/notify';

/**
 * Monitor system bootstrap completion, starting our app's
 * authorization process.
 */
export const startApp = createLogic({

  name: 'bootstrap.startApp',
  type: String(actions.system.bootstrap),
                                                 
  process({getState, action, api}, dispatch, done) {
    // start our app - by kicking off resource retrievals needed by our app
    dispatch( actions.system.bootstrap.loadFonts() );
    dispatch( actions.system.bootstrap.locateDevice() );
    done();
  },

});


/**
 * Load our system fonts.
 */
export const loadFonts = createLogic({

  name: 'bootstrap.loadFonts',
  type: String(actions.system.bootstrap.loadFonts),
  
  process({getState, action, api}, dispatch, done) {
    // asynchronously load our system resources
    api.system.loadResources()
       .then( () => {
         dispatch( actions.system.bootstrap.loadFonts.complete() );
         done();
       })
       .catch( err => {
         dispatch( actions.system.bootstrap.loadFonts.fail(err) );
         done();
       });
  },

});


/**
 * Geo locate our device.
 */
export const locateDevice = createLogic({

  name: 'bootstrap.locateDevice',
  type: String(actions.system.bootstrap.locateDevice),
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
      dispatch( actions.system.bootstrap.locateDevice.complete({lat: 38.752209, lng: -89.986610}) );

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
              dispatch( actions.system.bootstrap.locateDevice.complete({lat: location.coords.latitude, 
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

  name: 'bootstrap.monitorStartupProgress',
  type: /system.bootstrap.*.(complete|fail)/,
  
  process({getState, action, api}, dispatch, done) {

    const device    = getState().device;
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
    dispatch( actions.system.bootstrap.statusUpdate(statusMsg) );

    done();
  },

});



/**
 * Start app when system resources are available.
 */
export const startAppAuthProcess = createLogic({

  name: 'bootstrap.startAppAuthProcess',
  type: String(actions.system.bootstrap.statusUpdate),
  
  process({getState, action, api}, dispatch, done) {

    // when system resources are available, 
    // start the app by kicking off our authorization process
    if (action.statusMsg === 'READY') {
      dispatch( actions.auth.bootstrap() );
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
