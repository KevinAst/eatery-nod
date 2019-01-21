import {createFeature}      from 'feature-u';
import featureFlags         from '../../../../util/featureFlags';
import DiscoveryServiceMock from './DiscoveryServiceMock';

/**
 * The **discoveryServiceMock** feature **defines** the
 * **mock** 'discoveryService'.
 * 
 * This service is conditionally promoted when WIFI is NOT available
 * (i.e. mocking).
 */
export default createFeature({
  name: 'discoveryServiceMock',

  enabled: !featureFlags.useWIFI,

  fassets: {
    defineUse: {
      'discoveryService': new DiscoveryServiceMock(),
    },
  },

});
