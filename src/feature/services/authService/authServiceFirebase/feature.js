import {createFeature}     from 'feature-u';
import featureFlags        from '../../../../util/featureFlags';
import AuthServiceFirebase from './AuthServiceFirebase';

/**
 * The **'authServiceFirebase'** feature **defines** the **real**
 * 'authService' implementation (using the Firebase API).
 * 
 * This service is conditionally promoted when WIFI is available
 * (i.e. **not** mocking).
 */
export default createFeature({
  name:    'authServiceFirebase',

  enabled: featureFlags.useWIFI,

  fassets: {
    defineUse: {
      'authService': new AuthServiceFirebase(),
    },
  },

  appWillStart({fassets, curRootAppElm}) { // initialize FireBase (required by this service)
    fassets.initFireBase();
  },

});
