import React             from 'react';
import feature           from '.';  // TODO: currently importing feature for internal access - followup if/when we provide a single technique to access resources
import {createRouterCB}  from '../../util/feature-u';
import SplashScreen      from '../../util/comp/SplashScreen';


// ***
// *** 'startup' feature routes
// ***

export default createRouterCB({

  content(app, appState) {

    const deviceStatus = feature.reducer.getShapedState(appState).status;

    // promote a simple SplashScreen (with status) until our system is ready
    // NOTE: Errors related to system resources are promoted through independent user notifications
    if (deviceStatus !== 'READY') {
      // console.log(`xx 'startup' feature: DEVICE NOT READY: router -> SplashScreen with msg: ${deviceStatus}`);
      return <SplashScreen msg={deviceStatus}/>;
    }

    return null;
  },

});
