import {createLogic}  from 'redux-logic';
import firebase       from 'firebase';
import signInFormMeta from './iForms/signInFormMeta';
import actions        from '../actions';


/**
 * Monitor authorization startup, fetching credentials stored on device (if any).
 */
export const checkDeviceCredentials = createLogic({

  name: 'auth.checkDeviceCredentials',
  type: String(actions.auth.bootstrap),

  process({getState, action, api}, dispatch, done) {
    api.device.fetchCredentials()
       .then( (encodedCredentials) => {
         if (encodedCredentials) {
           dispatch( actions.auth.bootstrap.haveDeviceCredentials(encodedCredentials) );
         }
         else {
           dispatch( actions.auth.bootstrap.noDeviceCredentials() );
         }
         done();
       })
       .catch( err => {
         dispatch( actions.auth.bootstrap.fail(err) );
         done();
       });
  },

});


/**
 * Auto SignIn, when device credentials exist.
 */
export const autoSignIn = createLogic({

  name: 'auth.autoSignIn',
  type: String(actions.auth.bootstrap.haveDeviceCredentials),
  
  process({getState, action, api}, dispatch, done) {
    const {email, pass} = api.device.decodeCredentials(action.encodedCredentials);
    dispatch( actions.auth.signIn(email, pass) );
    done();
  },

});


/**
 * Manual SignIn, when NO device credentials exist.
 */
export const manualSignIn = createLogic({

  name: 'auth.manualSignIn',
  type: String(actions.auth.bootstrap.noDeviceCredentials),

  process({getState, action, api}, dispatch, done) {
    dispatch( actions.auth.signIn.open() );
    done();
  },

});


/**
 * Process logic for SignIn form.
 */
export const processSignIn = createLogic({

  name: 'auth.processSignIn',
  type: String(actions.auth.signIn.process),

  process({getState, action, api}, dispatch, done) {
    firebase.auth().signInWithEmailAndPassword(action.values.email, action.values.pass)
            .then( user => {
              console.log(`?? signInWithEmailAndPassword() WORKED, user: `, user);
              // ?? DO MORE ... what user info do we retain in state vs. utilize in firebase
              dispatch( actions.auth.signIn.close() );
              done();
              
            })
            .catch( (err) => {
              // re-display SignIn form WITH msg 
              const msg = err.code
                              // a firebase credentials problem  (treat generically so as to NOT give hacker insight)
                            ? 'Invalid SignIn credentials.'
                              // a REAL error (unexpected condition)
                            : 'An unexpected condition occurred, please try again later.';
              dispatch( actions.auth.signIn.open(action.values, msg) );
              done();
            });
  },

});

// promote all logic (accumulated in index.js)
// ... named exports (above) are used by unit tests :-)
export default [
  checkDeviceCredentials,
  autoSignIn,
  manualSignIn,

  // signIn logic (NOTE: form logic just be registered BEFORE app-specific logic)
  ...signInFormMeta.registrar.formLogic(), // inject the standard SignIn form-based logic modules
  processSignIn,
];
