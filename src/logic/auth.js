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
 * Manual SignIn, when NO device credentials exist, or user signs out.
 */
export const manualSignIn = createLogic({

  name: 'auth.manualSignIn',
  type: [
    String(actions.auth.bootstrap.noDeviceCredentials),
    String(actions.auth.signOut),
  ],

  process({getState, action, api}, dispatch, done) {
    dispatch( actions.auth.signIn.open() );
    done();
  },

});


/**
 * Interactive SignIn form processor.
 */
export const processSignIn = createLogic({

  name: 'auth.processSignIn',
  type: String(actions.auth.signIn.process),
  
  process({getState, action, api}, dispatch, done) {
    dispatch( actions.auth.signIn(action.values.email, action.values.pass) );
    done();
  },

});


/**
 * SignIn logic.
 */
export const signIn = createLogic({

  name: 'auth.signIn',
  type: String(actions.auth.signIn),

  process({getState, action, api}, dispatch, done) {
    firebase.auth().signInWithEmailAndPassword(action.email, action.pass)
            .then( user => {
              // console.log(`?? logic auth.signIn: signInWithEmailAndPassword() WORKED, user: `, user);
              dispatch( actions.auth.signIn.complete(user) );
              done();
              
            })
            .catch( (err) => {
              // re-display SignIn form WITH msg 
              const msg = err.code
                              // a firebase credentials problem  (treat generically so as to NOT give hacker insight)
                            ? 'Invalid SignIn credentials.'
                              // a REAL error (unexpected condition)
                            : 'An unexpected condition occurred, please try again later.';
              dispatch( actions.auth.signIn.open(action, msg) ); // NOTE: action is a cheap shortcut to domain (contains email/pass)
              done();
            });
  },

});



/**
 * Supplement signIn complete action with userProfile, triggering profile.changed action
 */
export const supplementSignInComplete = createLogic({

  name: 'auth.supplementSignInComplete',
  type: String(actions.auth.signIn.complete),

  // NOTE: action.user is available, we supplement action.userProfile
  // NOTE: We accomplish this in logic transform, to simulate an Atomic operation (as from the server).
  transform({getState, action, api}, next, reject) {

    const handleFetchProfileProblem = (err=null) => {
      // revert action to one that will re-display signIn with error message
      console.log(`***ERROR*** logic auth.supplementSignInComplete: encountered err (null indicates profile NOT found): `, err);
      const msg = err 
                    ? 'A problem was encountered fetching your user profile.'
                    : 'Your user profile does NOT exist.';
      const actionRedirect = actions.auth.signIn.open({email: action.user.email}, msg);
      next(actionRedirect);
    }

    // fetch our userProfile
    const dbRef = firebase.database().ref(`/userProfiles/${action.user.uid}`);
    dbRef.once('value')
         .then( snapshot => {
           const userProfile = snapshot.val();
           // console.log(`?? logic supplementSignInComplete: have userProfile: `, userProfile)
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

  process({getState, action, api}, dispatch, done) {
    dispatch( actions.profile.changed(action.userProfile) );
    done();
  },

});



/**
 * SignIn cleanup.
 */
export const signInCleanup = createLogic({

  name: 'auth.signInCleanup',
  type: String(actions.auth.signIn.complete),

  process({getState, action, api}, dispatch, done) {
    // console.log(`?? logic auth.signInCleanup: user.status: `, getState().auth.user.status);
    dispatch( actions.auth.signIn.close() ); // we are done with our signIn form
    done();
  },

});



/**
 * Check to see if account email has been verified.
 */
export const checkEmailVerified = createLogic({

  name: 'auth.checkEmailVerified',
  type: String(actions.auth.signIn.checkEmailVerified),

  transform({getState, action, api}, next, reject) {

    // fetch the most up-to-date user
    firebase.auth().currentUser.reload()
      .then(()=> {
        // supplement action with most up-to-date user
        action.user = firebase.auth().currentUser;
        next(action);
      })
      .catch( err => {
        console.error('logic: auth.checkEmailVerified: some problem with firebase.auth().currentUser.reload()', err);
        reject(); // nix the entire action
      });
  },

});




/**
 * Resend Email Verification.
 */
export const resendEmailVerification = createLogic({

  name: 'auth.resendEmailVerification',
  type: String(actions.auth.signIn.resendEmailVerification),

  transform({getState, action, api}, next) {
    firebase.auth().currentUser.sendEmailVerification();
    next(action);
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

  signIn,
  supplementSignInComplete,
  signInCleanup,

  checkEmailVerified,
  resendEmailVerification,
];
