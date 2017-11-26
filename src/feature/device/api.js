import Expo from 'expo';
import {AsyncStorage} from 'react-native';

/**
 * Load device fonts needed to run our app (NativeBase UI requirement)
 */
export function loadFonts() {

  // L8TR: Expo.Font.loadAsync() docs are lacking, may return a promise that will eventually error
  //       ... https://docs.expo.io/versions/v17.0.0/sdk/font.html#exponentfontloadasync
  // L8TR: May need to wrap in our own promise ESPECIALLY at a point when multiple resources are needed.

  // NativeBase UI needs these custom fonts
  return Expo.Font.loadAsync({
    'Roboto':        require('native-base/Fonts/Roboto.ttf'),
    'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
  });
}


/**
 * Fetch credentials stored on local device (if any).
 * 
 * @return {promise} a promise resolving to encodedCredentials (use
 * decodeCredentials() to decode), or null (when non-existent).
 */
export function fetchCredentials() {
  return AsyncStorage.getItem(credentialsKey);
}

/**
 * Store credentials on local device.
 * 
 * @return {promise} a promise strictly for error handling.
 */
export function storeCredentials(email, pass) {
  return AsyncStorage.setItem(credentialsKey, encodeCredentials(email, pass));
}


/**
 * Remove credentials on local device.
 * 
 * @return {promise} a promise strictly for error handling.
 */
export function removeCredentials() {
  return AsyncStorage.removeItem(credentialsKey);
}


/**
 * Encode the supplied email/pass into a string.
 */
export function encodeCredentials(email, pass) {
  return email+credentialsSeparator+pass;
}

/**
 * Decode the supplied encodedCredentials, resulting in:
 *    {
 *      email: string,
 *      pass:  string
 *    }
 * -or-
 *    null (if non-existent).
 */
export function decodeCredentials(encodedCredentials) {
  if (encodedCredentials) {
    const parts = encodedCredentials.split(credentialsSeparator);
    return {
      email: parts[0],
      pass:  parts[1],
    };
  }
  else {
    return null;
  }
}

const credentialsKey       = 'eatery-nod:credentials';
const credentialsSeparator = '/';
