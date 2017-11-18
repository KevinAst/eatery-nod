import createFeature     from './createFeature';
import shapedReducer     from './shapedReducer';
import managedExpansion  from './managedExpansion';
import runApp            from './runApp';
import createRoute       from './createRoute';

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
  managedExpansion,
  createRoute,
  runApp,
};

// NOTE: This default export supports CommonJS modules (otherwise Babel does NOT promote them).
//       Example:
//         const { createFeature } = require('feature-u');
//       -or-
//         const FeatureU   = require('feature-u');
export default {
  createFeature,
  shapedReducer,
  managedExpansion,
  createRoute,
  runApp,
};

