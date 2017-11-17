import {createFeature}  from '../../util/feature-u';
import name             from './featureName';
import actions          from './actions'; // TODO: QUERKYNESS of IFormMeta (aggravated by feature-u) ... actions MUST be expanded BEFORE IFormMeta instance (signInFormMeta)
import reducer          from './state';
import publicAPI        from './publicAPI';
import logic            from './logic';
import route            from './route';

/**
 * The 'auth' feature promotes complete user authentication by:
 * - gatheres user credentials from authentication screens (route, logic)
 * - manages "Auto SignIn" through retained device credentials (logic)
 * - manages interaction with authentication services (logic, reducer), 
 * - fetches user profile as part of the SignIn process (logic, reducer),
 * - deactivates app-specific features until authentication is complete (route)
 */
export default createFeature({
  name,
  reducer,

  publicAPI,

  logic,
  route,
});
