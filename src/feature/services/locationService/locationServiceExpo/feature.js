import {createFeature}  from 'feature-u';
import fassets          from './fassets';
import featureFlags     from '../../../../util/featureFlags';

/**
 * The **'locationServiceExpo'** feature is a minimilistic feature
 * that **defines** the "locationService" ... the **real** service
 * implementation (from the Expo API) that is promoted when we are not
 * mocking.
 */
export default createFeature({
  name:    'locationServiceExpo',
  enabled: featureFlags.wifiAvailable,
  fassets,
});
