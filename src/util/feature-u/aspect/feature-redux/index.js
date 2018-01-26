import reducerAspect  from './reducerAspect';
import slicedReducer  from './slicedReducer';

//*** 
//*** Promote all feature-redux utilities through this centralized module.
//*** 

// NOTE: This non-default export supports ES6 imports.
//       Example:
//         import { reducerAspect }    from 'feature-redux';
//       -or-
//         import * as FeatureURedux from 'feature-redux';
export {
  reducerAspect,
  slicedReducer,
};

// NOTE: This default export supports CommonJS modules (otherwise Babel does NOT promote them).
//       Example:
//         const { reducerAspect } = require('feature-redux');
//       -or-
//         const FeatureURedux = require('feature-redux');
export default {
  reducerAspect,
  slicedReducer,
};
