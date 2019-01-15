import {createFeature}       from 'feature-u';
import featureFlags          from '../../../../util/featureFlags';
import EateryServiceFirebase from './EateryServiceFirebase';

/**
 * The **eateryServiceFirebase** feature **defines** the **real**
 * 'eateryService' implementation (using the Firebase API).
 * 
 * This service is conditionally promoted when WIFI is available
 * (i.e. **not** mocking).
 */
export default createFeature({
  name:    'eateryServiceFirebase',

  enabled: featureFlags.useWIFI,

  fassets: {
    defineUse: {
      'eateryService': new EateryServiceFirebase(),
    },
  },

  appWillStart({fassets, curRootAppElm}) { // initialize FireBase (required by this service)
    fassets.initFireBase();
  },

});
