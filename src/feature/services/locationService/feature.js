import {createFeature}  from 'feature-u';
import fassets          from './fassets';

/**
 * The **'locationService'** feature is a minimilistic feature, simply
 * promoting the "locationService" use contract, allowing feature-u to
 * validate it's existance (supplied by other features ... either real
 * or mocked).
 */
export default createFeature({
  name: 'locationService',
  fassets,
});
