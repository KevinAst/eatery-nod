import {createFeature}  from '../../util/feature-u';
import logic            from './logic';

/**
 * The 'logActions' feature logs all dispatched actions.
 */
export default createFeature({
  name:    'logActions',
  enabled: true,
  logic,
});
