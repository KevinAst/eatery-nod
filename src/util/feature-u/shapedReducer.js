import verify         from '../verify';
import isString       from 'lodash.isstring';
import isFunction     from 'lodash.isfunction';

/**
 * @function shapedReducer
 * @description
 *
 * Embellish the supplied reducer with a shape property - a
 * specification (interpreted by feature-u) as to the location of the
 * reducer within the top-level appState tree.
 * 
 * Please refer to the Reducers documentation for more information and
 * examples.
 * 
 * SideBar: feature-u will default the location of non-embellished
 *          reducers to the feature name.
 * 
 * SideBar: When BOTH shapedReducer() and injectContext() are needed,
 *          shapedReducer() should be adorned in the outer function
 *          passed to createFunction().
 *
 * @param {string} shape the location of the managed state within the
 * overall top-level appState tree.  This can be a federated namespace
 * (delimited by dots).  Example: `'views.currentView'`
 *
 * @param {reducerFn} reducer a redux reducer function to be
 * embellished with the shape specification.
 *
 * @return {reducerFn} the supplied reducer, embellished with both the
 * shape and a standard selector:
 * ```js
 * reducer.shape: shape
 * reducer.getShapedState(appState): featureState
 * ```
 */
export default function shapedReducer(shape, reducer) {

  // validate parameters
  const check = verify.prefix('shapedReducer() parameter violation: ');

  check(shape,            'shape is required');
  check(isString(shape),  'shape must be a string');

  check(reducer,             'reducer is required');
  check(isFunction(reducer), 'reducer must be a function');

  // auto generate a standard selector for our shaped state
  const nodeNames = shape.split('.');
  function getShapedState(appState) {
    return nodeNames.reduce( (runningNode, nodeName) => runningNode[nodeName], appState );
  }

  // embellish/return the supplied reducer
  reducer.shape          = shape;
  reducer.getShapedState = getShapedState;
  return reducer;
}
