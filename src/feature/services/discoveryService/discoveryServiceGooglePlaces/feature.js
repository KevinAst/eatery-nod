import {createFeature}  from 'feature-u';
import featureFlags     from '../../../../util/featureFlags';
import DiscoveryServiceGooglePlaces from './DiscoveryServiceGooglePlaces';

/**
 * The **'discoveryServiceGooglePlaces'** feature **defines** the
 * **real** 'discoveryService' implementation (using the GooglePlaces
 * API).
 * 
 * This service is conditionally promoted when WIFI is available
 * (i.e. **not** mocking).
 */
export default createFeature({
  name: 'discoveryServiceGooglePlaces',

  enabled: featureFlags.useWIFI,

  fassets: {
    defineUse: {
      'discoveryService': new DiscoveryServiceGooglePlaces(),
    },
  },

});
