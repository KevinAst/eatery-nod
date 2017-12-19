import reducerAspect  from './reducerAspect';
import slicedReducer  from './slicedReducer';

//*** 
//*** Promote all feature-u-redux utilities through this centralized module.
//*** 

// NOTE: This non-default export supports ES6 imports.
//       Example:
//         import { reducerAspect }    from 'feature-u-redux';
//       -or-
//         import * as FeatureURedux from 'feature-u-redux';
export {
  reducerAspect,
  slicedReducer,
};

// NOTE: This default export supports CommonJS modules (otherwise Babel does NOT promote them).
//       Example:
//         const { reducerAspect } = require('feature-u-redux');
//       -or-
//         const FeatureURedux = require('feature-u-redux');
export default {
  reducerAspect,
  slicedReducer,
};
