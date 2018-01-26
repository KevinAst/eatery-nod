import logicAspect  from './logicAspect';

//*** 
//*** Promote all feature-redux utilities through this centralized module.
//*** 

// NOTE: This non-default export supports ES6 imports.
//       Example:
//         import { logicAspect }    from 'feature-redux';
//       -or-
//         import * as FeatureURedux from 'feature-redux';
export {
  logicAspect,
};

// NOTE: This default export supports CommonJS modules (otherwise Babel does NOT promote them).
//       Example:
//         const { logicAspect } = require('feature-redux');
//       -or-
//         const FeatureURedux = require('feature-redux');
export default {
  logicAspect,
};
