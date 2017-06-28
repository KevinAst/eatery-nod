import {AsyncStorage} from 'react-native';

/**
 * Fetch credentials stored on local device (if any).
 * 
 * @return {promise} a promise resolving to 
 * encodedCredentials (see: decodeCredentials()), 
 * or null (when non-existent).
 */
export function fetchCredentials() {
  return AsyncStorage.getItem(credentialsKey);
}

/**
 * Store credentials on local device.
 * 
 * @return {promise} a promise resolving to: encodeCredentials ... email/pass
 *    {
 *      email: string,
 *      pass:  string
 *    }
 * -or-
 *    null (if non-existent).
 */
export function storeCredentials(email, pass) {
  return AsyncStorage.setItem(credentialsKey, encodeCredentials(email, pass));
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
