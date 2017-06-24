import {createLogic}  from 'redux-logic';
import actions        from '../actions';

/**
 * Monitor system bootstrap process, loading device reources needed to
 * run our system.
 */
export const loadDeviceResources = createLogic({

  name: 'bootstrap.loadDeviceResources',
  type: String(actions.system.bootstrap),
  
  process({getState, action, api}, dispatch, done) {
    // asynchronously load our system resources
    api.system.loadResources()
       .then( () => {
         dispatch( actions.system.bootstrap.complete() );
         done();
       })
       .catch( err => {
         dispatch( actions.system.bootstrap.fail(err) );
         done();
       });
  },

});


/**
 * Monitor system bootstrap completion, starting our app's
 * authorization process.
 */
export const startAppAuthProcess = createLogic({

  name: 'bootstrap.startAppAuthProcess',
  type: String(actions.system.bootstrap.complete),
  
  process({getState, action, api}, dispatch, done) {
    // start our app - by kicking off our authorization process
    dispatch( actions.auth.bootstrap() );
    done();
  },

});

// NOTE: This default array export allows all logic modules to be easily
//       acumulated (see index.js).
//       ... while the named exports (above) support easy unit testing :-)
export default bootstrap = [
  loadDeviceResources,
  startAppAuthProcess,
];
