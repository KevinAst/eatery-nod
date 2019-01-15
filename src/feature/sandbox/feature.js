import {createFeature}  from 'feature-u';
import fassets          from './fassets';
import featureFlags     from '../../util/featureFlags'

/**
 * The **sandbox** feature promotes a variety of interactive tests,
 * used in development, that can easily be disabled.
 *
 *
 * **Screen Flow**
 *
 * You can see a Screen Flow diagram at: `docs/ScreenFlow.png`.
 */
export default createFeature({
  name:    'sandbox',
  enabled: featureFlags.sandbox,
  fassets,
});
