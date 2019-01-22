import {createFeature}  from 'feature-u';
import name             from './featureName';
import logic            from './logic';
import featureFlags     from '../../../util/featureFlags';

// feature: logActions
//          log all dispatched actions and resulting state (full details in README)
export default createFeature({
  name,
  enabled: featureFlags.log ? true : false, // NOTE: feature-u requires bookean, but featureFlags.log can be a string (e.g. 'verbose')
  logic,
});
