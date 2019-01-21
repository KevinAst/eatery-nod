import {createFeature}    from 'feature-u';
import featureFlags       from '../../../../util/featureFlags';
import EateryServiceMock  from './EateryServiceMock';

/**
 * The **eateryServiceMock** feature **defines** the **mock**
 * 'eateryService' implementation.
 * 
 * This service is conditionally promoted when WIFI is NOT available
 * (i.e. mocking).
 */
export default createFeature({
  name:    'eateryServiceMock',

  enabled: !featureFlags.useWIFI,

  fassets: {
    defineUse: {
      'eateryService': new EateryServiceMock(),
    },
  },

});
