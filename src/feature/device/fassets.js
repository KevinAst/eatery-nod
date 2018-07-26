import * as api          from './api';
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
    [`${featureName}.api`]: api,

    [`${featureName}.sel.areFontsLoaded`]: areFontsLoaded,
    [`${featureName}.sel.isDeviceReady`]:  isDeviceReady,
    [`${featureName}.sel.getDeviceLoc`]:   getDeviceLoc,

    [`${featureName}.actions.ready`]: actions.ready,
  }
};
