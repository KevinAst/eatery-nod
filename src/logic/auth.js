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
    console.log('?? processing valid signIn form!!');
    console.log('?? action.values: ', action.values);  // {"email":"resa@gmail.com","pass":"WowZee7","someNum":7}
    console.log('?? action.domain: ', action.domain);  // {"struct1":{"email":"resa@gmail.com"},"struct2":{"pass":"WowZee7"},"struct3":{"someNum":7}}
    // ?? eventually, do our work (issue: actions.auth.signIn(email, pass)  ... for now just close dialog
    setTimeout(() => {
      dispatch( actions.auth.signIn.close() );
      done();
    }, 5000); 
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
