import {createFeature}     from 'feature-u';
import featureFlags        from '../../../../util/featureFlags';
import LocationServiceExpo from './LocationServiceExpo';

/**
 * The **'locationServiceExpo'** feature **defines** the **real**
 * 'locationService' implementation (which uses the Expo API).
 * 
 * This service is conditionally promoted when we are **not** mocking.
 */
export default createFeature({
  name:    'locationServiceExpo',

  enabled: featureFlags.wifiAvailable,

  fassets: {
    defineUse: {
      'locationService': new LocationServiceExpo(),
    },
  }
});
