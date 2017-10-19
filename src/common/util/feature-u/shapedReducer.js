import verify         from '../verify';
import isString       from 'lodash.isstring';
import isFunction     from 'lodash.isfunction';

/**
 * Embellish the supplied reducer with a shape property - a
 * specification (interpreted by feature-u) as to the location of the
 * reducer within the top-level appState tree.
 * 
 * This can be a federated namespace (delimited by dots).
 *
 * As an example, `shapedReducer(reducer, 'views.currentView')`
 * injects the reducer in the following shape:
 * ```
 *   appState: {
 *     views: {
 *       currentView, // managed by supplied reducer
 *       ... other reducers
 *     },
 *     ... other reducers
 *   }
 * ```
 * 
 * SideBar: feature-u will default the location of non-embellished
 * reducers to the feature name.
 *
 * @param {reducerFn} reducer a redux reducer function to be
 * embellished with the shape specification.
 *
 * @param {string} shape the location of the managed state within the
 * overall top-level appState tree (see docs above).
 *
 * @return {reducerFn} the supplied reducer, embellished with shape.
 */
export default function shapedReducer(reducer, shape) {

  // validate parameters
  const check = verify.prefix('shapedReducer() parameter violation: ');

  check(reducer,             'reducer is required');
  check(isFunction(reducer), 'reducer must be a function');

  check(shape,            'shape is required');
  check(isString(shape),  'shape must be a string');

  // embellish/return the supplied reducer
  reducer.shape = shape;
  return reducer;
}
