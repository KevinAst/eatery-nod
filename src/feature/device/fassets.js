import {areFontsLoaded,
        isDeviceReady,
        getDeviceLoc}    from './state';
import actions           from './actions';
import featureName       from './featureName';

/**
 * The Public Face promoted by this feature.
 */
export default {
  define: {
    [`${featureName}.sel.areFontsLoaded`]: areFontsLoaded, // ?? may no longer be needed (with simplification) AT ALL or PUBLICLY
    [`${featureName}.sel.isDeviceReady`]:  isDeviceReady,
    [`${featureName}.sel.getDeviceLoc`]:   getDeviceLoc,

    [`${featureName}.actions.ready`]: actions.ready,  // ?? rename to deviceReady
  }
};
