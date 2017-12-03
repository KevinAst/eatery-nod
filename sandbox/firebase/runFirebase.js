import firebase          from 'firebase';
import firebaseAppConfig from '../../src/startup/firebase/firebaseAppConfig';

export default function runFirebase({sandboxFn,
                                     userChangedFn=null}={}) {

  // initialize firebase
  firebase.initializeApp(firebaseAppConfig);

  // regigester change notification to authorized user
  // NOTE: does NOT notify when email account has been verified
  if (userChangedFn) {
    firebase.auth().onIdTokenChanged( userChangedFn );
  };
  
  // signIn
  firebase.auth().signInWithEmailAndPassword('kevinast@gmail.com', '111111') // temporary id (don't expect this to work for you NOW)
          .then( user => {
            try {
              console.log(`runFirebase: signIn WORKED!! `);
              setTimeout( () => { // run sandbox in a seperate pseudo thread (so to speak) to see userChangedFn output
                sandboxFn();
              }, 0);
            }
            catch(err) {
              console.log(`runFirebase: UNEXPECTED signIn ERROR: `, err);
            } 
            finally {
              setTimeout( () => { // delay signout to receive feedback
                signOut();
              }, 5000);
            }
          })
          .catch( err => {
            console.log(`runFirebase: signIn FAILED: `, err);
            signOut();
          });


}

// signOut and exit app
// ... don't think this is really necessary
// ... do not think it has anything to do with whether our process stays up or not
function signOut() {

  // MUTUALLY EXCLUSIVE (do one of these):

  // 1) keep node process up forever ... to see notifications from email verification
  // console.log(`runFirebase: keep node process up forever ... to see notifications from email verification`);
  // process.stdin.resume();

  // 2) signout delete app
  //    NOTE: a) NOT REALLY NEEDED IN PRODUCTION
  //          b) OR here for that matter (don't think it does much)
  firebase.auth().signOut()
          .then( () => {
            console.log(`runFirebase: signOut!!`);
          })
          .catch( err => {
            console.log(`runFirebase: signOut FAILED: `, err);
          });
  
  firebase.app().delete()
          .then( () => {
            console.log(`runFirebase: app exited!!`);
            console.log(`runFirebase: NOTE: please be patient, UNSURE why, but this firebase node process takes a few seconds to exit :-(`);
          })
          .catch( err => {
            console.log(`runFirebase: app exit FAILED: `, err);
          });
}
