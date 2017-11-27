import {createFeature}  from '../../util/feature-u';
import publicAPI        from './publicAPI';

/**
 * The **'sandbox'** feature promotes a variety of interactive tests,
 * used in development, that can easily be disabled.
 */
export default createFeature({
  name:    'sandbox',
  enabled: false,
  publicAPI,
});
