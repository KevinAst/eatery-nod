import React                from 'react';
import {isDeviceReady,
        getDeviceStatusMsg} from './state';
import {featureRoute, 
        PRIORITY}           from '../../util/feature-u/aspect/feature-router';
import SplashScreen         from '../../util/comp/SplashScreen';


// ***
// *** The routes for this feature.
// ***

export default featureRoute({

  priority: PRIORITY.HIGH,

  content({app, appState}) {

    // promote a simple SplashScreen (with status) until our system is ready
    // NOTE: Errors related to system resources are promoted through independent user notifications
    if (!isDeviceReady(appState)) {
      // console.log(`xx DEVICE NOT READY: route -> SplashScreen with msg: ${getDeviceStatusMsg(appState)}`);
      return <SplashScreen msg={getDeviceStatusMsg(appState)}/>;
    }

    return null;
  },

});
