import createAspect               from './createAspect';
import createFeature,
       {addBuiltInFeatureKeyword} from './createFeature';
import managedExpansion           from './managedExpansion';
import launchApp                  from './launchApp';

//*** 
//*** Promote all feature-u utilities through a centralized module.
//*** 

// NOTE: This non-default export supports ES6 imports.
//       Example:
//         import { createFeature }    from 'feature-u';
//       -or-
//         import * as FeatureU from 'feature-u';
export {
  createAspect,
  createFeature,
  addBuiltInFeatureKeyword,
  managedExpansion,
  launchApp,
};

// NOTE: This default export supports CommonJS modules (otherwise Babel does NOT promote them).
//       Example:
//         const { createFeature } = require('feature-u');
//       -or-
//         const FeatureU   = require('feature-u');
export default {
  createAspect,
  createFeature,
  addBuiltInFeatureKeyword,
  managedExpansion,
  launchApp,
};

