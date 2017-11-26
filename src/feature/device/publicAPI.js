import {areFontsLoaded,
        isDeviceReady,
        getDeviceLoc}    from './state';

/**
 * The public API promoted by this feature through: app.device...
 */
export default {
  sel: {
    areFontsLoaded,
    isDeviceReady,
    getDeviceLoc,
  },
};
