import {createFeature}  from 'feature-u';
import name             from './featureName';
import fassets          from './fassets';
import reducer          from './state';
import logic            from './logic';
import route            from './route';
import appWillStart     from './appWillStart';
import appDidStart      from './appDidStart';


/**
 * The **device** feature initializes the device for use by the app.
 * It accomplishes the following:
 * 
 *  - kicks off the entire app, by dispatching a device bootstrap action
 *    **(appDidStart)**
 * 
 *  - performs device-specific initialization: platform-setup
 *    **(appWillStart)**
 * 
 *  - inject our notify utility in the root DOM
 *    **(appWillStart)**
 * 
 *  - loads device resources (fonts, geo location), triggered by
 *    bootstrap action **(logic, action, reducer)**
 * 
 *  - monitors the device initialization progress, syncing the device
 *    status **(logic, action, reducer)**
 * 
 *  - disables downstream visuals until the device is ready - displaying
 *    a SplashScreen **(route)**
 * 
 *  - emits **ready** action (when appropriate by monitoring device
 *    status), triggering downstream app process **(logic)**:
 *    ```
 *    fassets.device.ready()
 *    ```
 *
 * **State Transition**
 *
 * For a high-level overview of how actions, logic, and reducers
 * interact together to maintain this feature's state, please refer to
 * `docs/StateTransition.txt`.
 *
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

  appWillStart,
  appDidStart,
});
