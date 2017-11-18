import {createFeature}  from '../../util/feature-u';
import name             from './featureName';
import logic            from './logic';

/**
 * The 'logActions' feature logs all dispatched actions.
 */
export default createFeature({
  name,
  enabled: true,
  logic,
});
