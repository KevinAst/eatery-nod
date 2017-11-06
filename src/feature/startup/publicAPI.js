import {injectContext}  from '../../util/feature-u';

/**
 * The 'startup' feature public API, promoted through app.startup
 */
export default injectContext( (feature, app) => ({
  selectors: {
    fontsLoaded: (appState) => feature.reducer.getShapedState(appState).fontsLoaded === true, // NOTE: fontsLoaded true check IS REQUIRED, as it can also contain error string
    deviceReady: (appState) => feature.reducer.getShapedState(appState).status === 'READY',
  },
}) );
