import firebase          from 'firebase';
import firebaseAppConfig from './firebaseAppConfig';

/**
 * Initialize FireBase (invoked at app startup).
 */
export default function initFireBase() {
  firebase.initializeApp(firebaseAppConfig);
}
