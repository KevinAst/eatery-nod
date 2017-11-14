import {createFeature,
        shapedReducer}  from '../../util/feature-u';
import name             from './featureName';
import reducer          from './state';
import publicAPI        from './publicAPI';
import logic            from './logic';
import route            from './route';
import appWillStart     from './appWillStart';
import appDidStart      from './appDidStart';

/**
 * The 'startup' feature bootstraps our entire app by:
 *  - dispatches our bootstrap action that starts the entire app (appDidStart)
 *  - performs initialization: platform-setup, firebase, notify (appWillStart)
 *  - starts app running on bootstrap action (logic)
 *  - fetches resources: fonts, geo location (logic, action, reducer)
 *  - monitors startup process, syncing the device status (logic, action, reducer)
 *  - displays SplashScreen till the the device is ready (route)
 *  - starts authorization process when our device is ready (logic)
 */
export default createFeature({
  name,
  reducer:  shapedReducer('device', reducer),

  publicAPI,

  logic,
  route,

  appWillStart,
  appDidStart,
});
