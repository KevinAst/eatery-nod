import * as api          from './api';
import {areFontsLoaded,
        isDeviceReady,
        getDeviceLoc}    from './state';

/**
 * The public API promoted by this feature through: app.device...
 */
export default {
  api,
  sel: {
    areFontsLoaded,
    isDeviceReady,
    getDeviceLoc,
  },
};
