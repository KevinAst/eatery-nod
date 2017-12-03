import {createFeature}  from '../../util/feature-u';
import name             from './featureName';
import actions          from './actions'; // TODO: QUERKYNESS of IFormMeta (aggravated by feature-u) ... actions MUST be expanded BEFORE IFormMeta instance (signInFormMeta)
import reducer          from './state';
import publicAPI        from './publicAPI';
import logic            from './logic';
import route            from './route';

/**
 * The **'auth'** feature promotes complete user authentication.  
 * It accomplishes the following:
 * 
 *  - starts authorization process by monitoring device ready action
 *    (`app.device.actions.ready`) **(logic)**
 * 
 *    - interacts with authentication services **(logic, reducer)**
 * 
 *    - gathers user credentials from various authentication screens
 *      **(route, logic)**
 * 
 *    - manages "Auto SignIn" through retained device credentials
 *      **(logic)**
 * 
 *    - fetches user profile as part of the SignIn process **(logic,
 *      reducer)**
 * 
 *  - disables app-specific visuals until the user is fully authenticated,
 *    by promoting various authentication screens until authentication
 *    is complete **(route)**
 * 
 *  - emits key action that triggers downstream app process **(logic)**:
 *    ```
 *    app.auth.actions.userProfileChanged(userProfile({name,pool}))
 *    ```
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
  reducer,

  publicAPI,

  logic,
  route,
});
