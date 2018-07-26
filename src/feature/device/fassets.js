import * as api          from './api';
import {areFontsLoaded,
        isDeviceReady,
        getDeviceLoc}    from './state';
import actions           from './actions';

/**
 * The Public Face promoted by this feature.
 */
export default {
  define: {
    'device.api': api,

    'device.sel.areFontsLoaded': areFontsLoaded,
    'device.sel.isDeviceReady':  isDeviceReady,
    'device.sel.getDeviceLoc':   getDeviceLoc,

    'device.actions.ready': actions.ready,
  }
};
