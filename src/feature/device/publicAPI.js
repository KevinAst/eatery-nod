import * as api          from './api';
import {areFontsLoaded,
        isDeviceReady,
        getDeviceLoc}    from './state';
import actions           from './actions';

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
  actions: {
    ready: actions.ready,
  },
};
