import {createFeature}  from 'feature-u';
import name             from './featureName';
import actions          from './actions'; // TODO: QUERKYNESS of IFormMeta (aggravated by feature-u) ... actions MUST be expanded BEFORE IFormMeta instance (eateryFilterFormMeta)
import fassets          from './fassets';
import reducer          from './state';
import logic            from './logic';
import route            from './route';

/**
 * The **discovery** feature manages and promotes the discovery view
 * ... a list of "discoveries" from GooglePlaces.  Eateries
 * can be added/removed within the pool by simply checking/unchecking
 * the discoveries.
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

  fassets,

  reducer,
  logic,
  route,
});
