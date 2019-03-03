import {createFeature}  from 'feature-u';
import fassets          from './fassets';
import featureFlags     from '../../../featureFlags'

// feature: sandbox
//          promote interactive tests (full details in README)
export default createFeature({
  name:    'sandbox',
  enabled: featureFlags.sandbox,
  fassets,
});
