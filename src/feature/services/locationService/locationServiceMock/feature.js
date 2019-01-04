import {createFeature}  from 'feature-u';
import fassets          from './fassets';
import featureFlags     from '../../../../util/featureFlags';

/**
 * The **'locationServiceMock'** feature is a minimilistic feature
 * that **defines** the "locationService" ... the **mock** service
 * implementation that is promoted when we are mocking.
 */
export default createFeature({
  name:    'locationServiceMock',
  enabled: !featureFlags.wifiAvailable,
  fassets,
});
