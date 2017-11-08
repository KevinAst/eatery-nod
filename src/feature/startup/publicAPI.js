import {areFontsLoaded,
        isDeviceReady}    from './state';

/**
 * The 'startup' feature public API, promoted through app.startup
 */
export default {
  selectors: {
    areFontsLoaded,
    isDeviceReady,
  },
};
