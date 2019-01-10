import {createLogic}        from 'redux-logic';
import {expandWithFassets}  from 'feature-u';
import featureName          from './featureName';
import actions              from './actions';
import * as sel             from './state';
import signInFormMeta       from './signInFormMeta';
import {alert, toast}       from '../../util/notify';

/**
 * Start our authorization process, once the device is ready.
 * 
 * NOTE: We could auto-start our auth process (via feature-u app life cycle handlers),
 *       except our downstream processes are dependent on device.loc, so we wait and
 *       trigger the process here.
 */
export const startAuthorization = expandWithFassets( (fassets) => createLogic({

  name: `${featureName}.startAuthorization`,
  type: String(fassets.device.actions.ready),
  
  process({getState, action}, dispatch, done) {
    dispatch( actions.bootstrap() );
    done();
  },
}));


/**
 * Monitor authorization startup, fetching credentials stored on device (if any).
 */
export const checkDeviceCredentials = createLogic({

  name: `${featureName}.checkDeviceCredentials`,
  type: String(actions.bootstrap),

  process({getState, action, fassets}, dispatch, done) {
    fassets.device.api.fetchCredentials()
       .then( (encodedCredentials) => {
         if (encodedCredentials) {
           dispatch( actions.bootstrap.haveDeviceCredentials(encodedCredentials) );
         }
         else {
           dispatch( actions.bootstrap.noDeviceCredentials() );
         }
         done();
       })
       .catch( err => {
         dispatch( actions.bootstrap.fail(err) );
         done();
       });
  },

});


/**
 * Auto SignIn, when device credentials exist.
 */
export const autoSignIn = createLogic({

  name: `${featureName}.autoSignIn`,
  type: String(actions.bootstrap.haveDeviceCredentials),
  
  process({getState, action, fassets}, dispatch, done) {
    const {email, pass} = fassets.device.api.decodeCredentials(action.encodedCredentials);
    dispatch( actions.signIn(email, pass) );
    done();
  },

});


/**
 * Manual SignIn, when NO device credentials exist, or user signs out.
 */
export const manualSignIn = createLogic({

  name: `${featureName}.manualSignIn'`,
  type: [
    String(actions.bootstrap.noDeviceCredentials),
    String(actions.signOut),
  ],

  process({getState, action}, dispatch, done) {
    dispatch( actions.signIn.open() );
    done();
  },

});


/**
 * Interactive SignIn form processor.
 */
export const processSignIn = createLogic({

  name: `${featureName}.processSignIn`,
  type: String(actions.signIn.process),
  
  process({getState, action}, dispatch, done) {
    dispatch( actions.signIn(action.values.email, action.values.pass) );
    done();
  },

});


/**
 * SignIn logic.
 */
export const signIn = createLogic({

  name: `${featureName}.signIn`,
  type: String(actions.signIn),
  warnTimeout: 0, // long-running logic ... UNFORTUNATELY signin using our firebase service is sometimes EXCRUCIATINGLY SLOW!

  process({getState, action, fassets}, dispatch, done) {
    
    fassets.authService.signIn(action.email, action.pass)

           .then( user => { // user has successfully signed in

             // retain these credentials on our device (to streamline subsequent app launch)
             fassets.device.api.storeCredentials(action.email, action.pass)
                    .catch( (err) => { // unexpected error in a react-native API
                      // hmmmm ... nested errors in a promise are caught in the outer catch (need to better understand this)
                    });

             // communicate a new user is in town
             dispatch( actions.signIn.complete(user) );
             done();
           })

           .catch( (err) => {

             // Errors from authService conditionally provides an err.code
             //  - when .code is supplied, it enumerates a user specific credentials problem (like "invalid password")
             //    ... we do NOT expose this to the user (so as to NOT give hacker insight)
             //        rather we generalize it to the user ('Invalid SignIn credentials.')
             //  - when .code is NOT supplied, it represents an unexpected condition
             const invalidCredentials = err.code ? true : false; // true: user problem, false: unexpected error

             // for unexpected errors, display msg to user
             if (!invalidCredentials) {
               toast.error({  // ... will auto close -OR- when "details" is clicked
                 msg: err.formatClientMsg(),
                 actions: [
                   { txt:    'detail',
                     action: () => {
                       alert.error({ msg: ''+err });
                     }},
                 ]
               });
             };

             // re-display SignIn form, prepopulated with appropriat msg
             const msg = err.formatClientMsg();
             dispatch( actions.signIn.open(action, msg) ); // NOTE: action is a cheap shortcut to domain (contains email/pass) ... pre-populating sign-in form with last user input

             done();
           });
  },

});



/**
 * Supplement signIn complete action by triggering profile.changed action,
 * causing eateries view to bootstrap.
 */
export const supplementSignInComplete = createLogic({

  name: `${featureName}.supplementSignInComplete`,
  type: String(actions.signIn.complete),

  process({getState, action}, dispatch, done) {
    // NOTE: Currently, this is the only place where userProfileChanged is dispatched.
    //       It stimulates the eateries view to get the ball rolling (displaying the correct pool)
    //       In the future, userProfileChanged is dispatched dynamically, when the user has the ability to change their pool.
    dispatch( actions.userProfileChanged(action.user) ); // use the same user from our our monitored action!!
    done();
  },

});


/**
 * SignIn cleanup.
 */
export const signInCleanup = createLogic({

  name: `${featureName}.signInCleanup`,
  type: String(actions.signIn.complete),

  process({getState, action}, dispatch, done) {
    // console.log(`xx logic ${featureName}.signInCleanup: user.status: '${sel.getUser(getState()).getAuthStatus()}'`);
    dispatch( actions.signIn.close() ); // we are done with our signIn form
    done();
  },

});



/**
 * Check to see if account email has been verified.
 */
export const checkEmailVerified = createLogic({

  name: `${featureName}.checkEmailVerified`,
  type: String(actions.signIn.checkEmailVerified),

  transform({getState, action, fassets}, next, reject) {

    // fetch the most up-to-date user
    fassets.authService.refreshUser()
           .then( user => {
             // suplement action with the most up-to-date user
             action.user = user;
             next(action);
           })
           .catch( err => {
             // report unexpected error to user
             toast.error({  // ... will auto close -OR- when "details" is clicked
               msg: err.formatClientMsg(),
               actions: [
                 { txt:    'detail',
                   action: () => {
                     alert.error({ msg: ''+err });
                   }},
               ]
             });

             // nix the entire action
             reject();
           });
  },

});




/**
 * Resend Email Verification.
 */
export const resendEmailVerification = createLogic({

  name: `${featureName}.resendEmailVerification`,
  type: String(actions.signIn.resendEmailVerification),

  transform({getState, action, fassets}, next) {
    fassets.authService.resendEmailVerification()
    next(action);
  },

});


/**
 * SignOut logic.
 */
export const signOut = createLogic({

  name: `${featureName}.signOut`,
  type: String(actions.signOut),

  process({getState, action, fassets}, dispatch, done) {
    fassets.authService.signOut()
           .catch( (err) => {
             // report unexpected error to user
             toast.error({  // ... will auto close -OR- when "details" is clicked
               msg:     err.formatClientMsg(),
               actions: [
                 { txt:    'detail',
                   action: () => {
                     alert.error({ msg: ''+err });
                   }},
               ]
             });
           });

    fassets.device.api.removeCredentials()
       .catch( (err) => {
         // report unexpected error to user
         toast.error({  // ... will auto close -OR- when "details" is clicked
           msg:     'A problem was encountered trying to remove your credentials from the device.',
           actions: [
             { txt:    'detail',
               action: () => {
                 alert.error({ msg: ''+err });
               }},
           ]
         });
       });

    done();
  },

});



// promote all logic modules for this feature
// ... NOTE: individual logic modules are unit tested using the named exports.
export default expandWithFassets( (fassets) => [

  startAuthorization(fassets),

  checkDeviceCredentials,
  autoSignIn,
  manualSignIn,

  // signIn logic (NOTE: form logic just be registered BEFORE app-specific logic)
  ...signInFormMeta.registrar.formLogic(), // inject the standard SignIn form-based logic modules
  processSignIn,

  signIn,
  supplementSignInComplete,
  signInCleanup,

  checkEmailVerified,
  resendEmailVerification,

  signOut,
]);
