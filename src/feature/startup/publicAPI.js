import {injectContext}    from '../../util/feature-u';
import {areFontsLoaded,
        isDeviceReady}    from './reducer';

/**
 * The 'startup' feature public API, promoted through app.startup
 */
export default injectContext( (feature, app) => ({
  selectors: {
    areFontsLoaded,
    isDeviceReady,
  },
}) );
