import {createLogic}        from 'redux-logic';
import firebase             from 'firebase';
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
  warnTimeout: 0, // long-running logic ... UNFORTUNATELY firebase is sometimes EXCRUCIATINGLY SLOW!

  process({getState, action, fassets}, dispatch, done) {
    firebase.auth().signInWithEmailAndPassword(action.email, action.pass)
            .then( user => {
              // console.log(`xx logic ${featureName}.signIn: signInWithEmailAndPassword() WORKED, user: `, user);
              fassets.device.api.storeCredentials(action.email, action.pass)
                 .catch( (err) => {
                   // hmmmm ... nested errors in a promise are caught in the outer catch (need to better understand this)
                 });
              dispatch( actions.signIn.complete(user) );
              done();
            })
            .catch( (err) => {

              const unexpectedMsg = 'An unexpected condition occurred, please try again later.';

              // firebase provides a .code, enumerating credentials problem
              // ... we do NOT interpret this, rather treat it generically (so as to NOT give hacker insight)
              const invalidCredentials = err.code ? true : false;

              // for unexpected errors, display msg to user
              if (!invalidCredentials) {
                toast.error({  // ... will auto close -OR- when "details" is clicked
                  msg:     unexpectedMsg,
                  actions: [
                    { txt:    'detail',
                      action: () => {
                        alert.error({ msg: ''+err });
                      }},
                  ]
                });
              }

              // re-display SignIn form
              const msg = invalidCredentials ? 'Invalid SignIn credentials.' : unexpectedMsg;
              dispatch( actions.signIn.open(action, msg) ); // NOTE: action is a cheap shortcut to domain (contains email/pass)

              done();
            });
  },

});



/**
 * Supplement signIn complete action with userProfile, triggering profile.changed action
 */
export const supplementSignInComplete = createLogic({

  name: `${featureName}.supplementSignInComplete`,
  type: String(actions.signIn.complete),

  // NOTE: action.user is available, we supplement action.userProfile
  // NOTE: We accomplish this in logic transform, to simulate an Atomic operation (as from the server).
  transform({getState, action}, next, reject) {

    const handleFetchProfileProblem = (err=null) => {
      // revert action to one that will re-display signIn with error message
      console.log(`***ERROR*** logic ${featureName}.supplementSignInComplete: encountered err (null indicates profile NOT found): `, err);
      const msg = err 
                ? 'A problem was encountered fetching your user profile.'
                : 'Your user profile does NOT exist.';
      const actionRedirect = actions.signIn.open({email: action.user.email}, msg);
      next(actionRedirect);
    }

    // fetch our userProfile
    const dbRef = firebase.database().ref(`/userProfiles/${action.user.uid}`);
    dbRef.once('value')
         .then( snapshot => {
           const userProfile = snapshot.val();
           // console.log(`xx logic supplementSignInComplete: have userProfile: `, userProfile)
           if (!userProfile) {
             handleFetchProfileProblem();
           }
           else {
             // supplement action with userProfile
             action.userProfile = userProfile
             next(action);
           }
         })
         .catch( err => {
           handleFetchProfileProblem(err);
         });
  },

  process({getState, action}, dispatch, done) {
    dispatch( actions.userProfileChanged(action.userProfile) );
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
    // console.log(`xx logic ${featureName}.signInCleanup: user.status: '${sel.getUserStatus(getState())}'`);
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

  transform({getState, action}, next, reject) {

    // fetch the most up-to-date user
    firebase.auth().currentUser.reload()
            .then(()=> {
              // supplement action with most up-to-date user
              action.user = firebase.auth().currentUser;
              next(action);
            })
            .catch( err => {
              console.error('logic: ${featureName}.checkEmailVerified: some problem with firebase.auth().currentUser.reload()', err);
              reject(); // nix the entire action
            });
  },

});




/**
 * Resend Email Verification.
 */
export const resendEmailVerification = createLogic({

  name: `${featureName}.resendEmailVerification`,
  type: String(actions.signIn.resendEmailVerification),

  transform({getState, action}, next) {
    firebase.auth().currentUser.sendEmailVerification();
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
    firebase.auth().signOut()
            .catch( (err) => {
              // simply report unexpected error to user
              toast.error({  // ... will auto close -OR- when "details" is clicked
                msg:     'A problem was encountered trying to signOut of firebase.',
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
         // simply report unexpected error to user
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
