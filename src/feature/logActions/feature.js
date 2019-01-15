import {createFeature}  from 'feature-u';
import name             from './featureName';
import logic            from './logic';
import featureFlags     from '../../util/featureFlags';

/**
 * The **logActions** feature logs all dispatched actions and resulting state.
 */
export default createFeature({
  name,
  enabled: featureFlags.log,
  logic,
});
