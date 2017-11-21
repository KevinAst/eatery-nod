import {areFontsLoaded,
        isDeviceReady,
        getDeviceLoc}    from './state';

/**
 * The public API promoted by this feature through: app.startup...
 */
export default {
  sel: {
    areFontsLoaded,
    isDeviceReady,
    getDeviceLoc,
  },
};
