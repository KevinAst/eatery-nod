import {createFeature}  from 'feature-u';
import featureFlags     from '../../../../util/featureFlags';
import AuthServiceMock  from './AuthServiceMock';

/**
 * The **authServiceMock** feature **defines** the **mock**
 * 'authService' implementation.
 * 
 * This service is conditionally promoted when WIFI is NOT available
 * (i.e. mocking).
 */
export default createFeature({
  name:    'authServiceMock',

  enabled: !featureFlags.useWIFI,

  fassets: {
    defineUse: {
      'authService': new AuthServiceMock(),
    },
  },

});
