import firebase          from 'firebase';
import firebaseAppConfig from './firebaseAppConfig';

/**
 * Initialize FireBase (invoked at app startup).
 */
export default function initFireBase() {
  firebase.initializeApp(firebaseAppConfig);

  // temp work-around to long timer android warning (using firebase)
  // TODO: check back for ultimate solution: https://github.com/facebook/react-native/issues/12981
  console.ignoredYellowBox = ['Setting a timer for a long period of time'];
}
