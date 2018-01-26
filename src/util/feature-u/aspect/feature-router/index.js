import routeAspect       from './routeAspect';
import featureRoute,
       {PRIORITY}        from './featureRoute';

//*** 
//*** Promote all feature-router utilities through this centralized module.
//*** 

// NOTE: This non-default export supports ES6 imports.
//       Example:
//         import { routeAspect }    from 'feature-router';
//       -or-
//         import * as FeatureURedux from 'feature-router';
export {
  routeAspect,
  featureRoute,
  PRIORITY,
};

// NOTE: This default export supports CommonJS modules (otherwise Babel does NOT promote them).
//       Example:
//         const { routeAspect } = require('feature-router');
//       -or-
//         const FeatureURedux = require('feature-router');
export default {
  routeAspect,
  featureRoute,
  PRIORITY,
};
