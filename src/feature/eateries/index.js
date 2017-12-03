import {createFeature}  from '../../util/feature-u';
import name             from './featureName';
import actions          from './actions'; // TODO: QUERKYNESS of IFormMeta (aggravated by feature-u) ... actions MUST be expanded BEFORE IFormMeta instance (eateryFilterFormMeta)
import publicFace       from './publicFace';
import reducer          from './state';
import logic            from './logic';
import route            from './route';
import appDidStart      from './appDidStart';

/**
 * The **'eateries'** feature manages and promotes the eateries view
 * ... a list of the pooled (and filtered) restaurants, with the ability
 * to select an eatery through a random spin.  Selected eateries provides
 * the ability to phone, visit their web site, and navigate to them.
 *
 * **State Transition**
 *
 * For a high-level overview of how actions, logic, and reducers
 * interact together to maintain this feature's state, please refer to
 * `docs/StateTransition.txt`.
 *
 * **Screen Flow**
 *
 * You can see a Screen Flow diagram at: `docs/ScreenFlow.png`.
 */
export default createFeature({
  name,

  publicFace,

  reducer,
  logic,
  route,

  appDidStart,
});
