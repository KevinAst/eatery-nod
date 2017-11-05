import createFeature  from './createFeature';
import shapedReducer  from './shapedReducer';
import injectContext  from './injectContext';
import runApp         from './runApp';
import createRouterCB from './createRouterCB';

//*** 
//*** Promote all feature-u utilities through a centralized module.
//*** 

// NOTE: This non-default export supports ES6 imports.
//       Example:
//         import { createFeature }    from 'feature-u';
//       -or-
//         import * as FeatureU from 'feature-u';
export {
  createFeature,
  shapedReducer,
  injectContext,
  runApp,
  createRouterCB,
};

// NOTE: This default export supports CommonJS modules (otherwise Babel does NOT promote them).
//       Example:
//         const { createFeature } = require('feature-u');
//       -or-
//         const FeatureU   = require('feature-u');
export default {
  createFeature,
  shapedReducer,
  injectContext,
  runApp,
  createRouterCB,
};

