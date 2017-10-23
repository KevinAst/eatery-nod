import React             from 'react';
import miniMeta          from './miniMeta';
import {createRouterCB}  from '../../util/feature-u';
import SplashScreen      from '../../util/comp/SplashScreen';


// ***
// *** 'startup' feature routes
// ***

export default createRouterCB({

  content(app, appState) {

    const device = miniMeta.getFeatureState(appState);

    // promote a simple SplashScreen (with status) until our system is ready
    // NOTE: Errors related to system resources are promoted through independent user notifications
    if (device.status !== 'READY') {
      // console.log(`xx 'startup' feature: DEVICE NOT READY: router -> SplashScreen with msg: ${device.status}`);
      return <SplashScreen msg={device.status}/>;
    }

    return null;
  },

});
