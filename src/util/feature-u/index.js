import createAspect               from './createAspect';
import createFeature,
       {addBuiltInFeatureKeyword} from './createFeature';
import launchApp                  from './launchApp';
import managedExpansion           from './managedExpansion';

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
  managedExpansion,
  launchApp,
  createAspect,
  addBuiltInFeatureKeyword,
};

// NOTE: This default export supports CommonJS modules (otherwise Babel does NOT promote them).
//       Example:
//         const { createFeature } = require('feature-u');
//       -or-
//         const FeatureU   = require('feature-u');
export default {
  createFeature,
  managedExpansion,
  launchApp,
  createAspect,
  addBuiltInFeatureKeyword,
};

