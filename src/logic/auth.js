import {createLogic}  from 'redux-logic';
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
    dispatch( actions.auth.interactiveSignIn.open() );
    done();
  },

});


/**
 * Process SignIn from form.
 */
export const processSignIn = createLogic({

  name: 'auth.processSignIn',
  type: String(actions.auth.interactiveSignIn.process),

  process({getState, action, api}, dispatch, done) {
    // ?? eventually, do our work ... for now just close dialog
    setTimeout(() => {
      dispatch( actions.auth.interactiveSignIn.close() );
      done();
    }, 2000); 
  },

});

// promote all logic (accumulated in index.js)
// ... named exports (above) are used by unit tests :-)
export default [
  checkDeviceCredentials,
  autoSignIn,
  manualSignIn,

  // signIn logic (NOTE: form logic just be registered BEFORE app-specific logic)
  ...signInFormMeta.registrar.formLogic(actions.auth.interactiveSignIn), // inject the standard SignIn form-based logic modules
  processSignIn,
];
