import {injectContext}    from '../../util/feature-u';
import {fontsLoaded,
        deviceReady}      from './reducer';

/**
 * The 'startup' feature public API, promoted through app.startup
 */
export default injectContext( (feature, app) => ({
  selectors: {
    fontsLoaded,
    deviceReady,
  },
}) );
