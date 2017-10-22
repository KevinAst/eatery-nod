import React             from 'react';
import {createRouterCB}  from '../../common/util/feature-u';
import SplashScreen      from '../../common/comp/SplashScreen';

// ***
// *** startup feature routes
// ***

export default createRouterCB({

  content(app, appState) {

    const device = appState.device;

    // promote a simple SpashScreen (with status) until our system is ready
    // NOTE: Errors related to system resources are promoted through independent user notifications
    if (device.status !== 'READY') {
      // console.log(`xx startup feature: DEVICE NOT READY: router -> SpashScreen with msg: ${device.status}`);
      return <SplashScreen msg={device.status}/>;
    }

    return null;
  },

});
