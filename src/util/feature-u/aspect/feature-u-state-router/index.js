import routeAspect  from './routeAspect';
import createRoute  from './createRoute';

//*** 
//*** Promote all feature-u-redux utilities through this centralized module.
//*** 

// NOTE: This non-default export supports ES6 imports.
//       Example:
//         import { routeAspect }    from 'feature-u-redux';
//       -or-
//         import * as FeatureURedux from 'feature-u-redux';
export {
  routeAspect,
  createRoute,
};

// NOTE: This default export supports CommonJS modules (otherwise Babel does NOT promote them).
//       Example:
//         const { routeAspect } = require('feature-u-redux');
//       -or-
//         const FeatureURedux = require('feature-u-redux');
export default {
  routeAspect,
  createRoute,
};
