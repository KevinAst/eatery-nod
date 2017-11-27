import {createFeature}  from '../../util/feature-u';
import name             from './featureName';
import reducer          from './state';
import publicAPI        from './publicAPI';
import logic            from './logic';
import route            from './route';
import appWillStart     from './appWillStart';
import appDidStart      from './appDidStart';

/**
 * The **'device'** feature initializes the device for use by the app.
 * It accomplishes the following:
 * 
 *  - kicks off the entire app, by dispatching a device bootstrap action
 *    **(appDidStart)**
 * 
 *  - performs device-specific initialization: platform-setup, notify
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
 *    app.device.ready()
 *    ```
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

  publicAPI,

  logic,
  route,

  appWillStart,
  appDidStart,
});
