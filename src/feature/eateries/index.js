import {createFeature}  from '../../util/feature-u';
import name             from './featureName';
import actions          from './actions'; // TODO: QUERKYNESS of IFormMeta (aggravated by feature-u) ... actions MUST be expanded BEFORE IFormMeta instance (eateryFilterFormMeta)
import reducer          from './state';
// import publicAPI     from './publicAPI'; // ?? L8TR: if needed
import logic            from './logic';
import route            from './route';
import appDidStart      from './appDidStart';

/**
 * The **'eateries'** feature ??? bla bla bla
 * accomplishing the following:
 *
 * - ??? **(aspect)**
 *
 * **State Transition**
 *
 * For a high-level overview of how actions, logic, and reducers
 * interact together to maintain this feature's state, please refer to
 * `StateTransition.txt`.
 */
export default createFeature({
  name,
  reducer,

  // ?? publicAPI,

  logic,
  route,

  appDidStart,
});
