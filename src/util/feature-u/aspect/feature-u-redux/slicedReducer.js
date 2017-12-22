import verify         from '../../../verify';
import isString       from 'lodash.isstring';
import isFunction     from 'lodash.isfunction';

/**
 * @function slicedReducer
 * @description
 *
 * Embellish the supplied reducer with a slice property - a
 * specification (interpreted by **feature-u-redux**) as to the
 * location of the reducer within the top-level appState tree.
 *
 * **Please refer to the User Docs** for a complete description with
 * examples.
 *
 * **SideBar**: For reducer aspects, `slicedReducer()` should always
 *              wrap the the outer function passed to
 *              `createFeature()`, even when `managedExpansion()` is
 *              used.  This gives your app code access to the
 *              embellished `getSlicedState()` selector, even prior to
 *              expansion occurring (_used as a single-source-of-truth
 *              in your selector definitions_).
 *
 * @param {string} slice the location of the managed state within the
 * overall top-level appState tree.  This can be a federated namespace
 * (delimited by dots).  Example: `'views.currentView'`
 *
 * @param {reducerFn} reducer a redux reducer function to be
 * embellished with the slice specification.
 *
 * @return {reducerFn} the supplied reducer, embellished with both the
 * slice and a convenience selector:
 * ```js
 * reducer.slice: slice
 * reducer.getSlicedState(appState): slicedState
 * ```
 */
export default function slicedReducer(slice, reducer) {

  // validate parameters
  const check = verify.prefix('slicedReducer() parameter violation: ');

  check(slice,            'slice is required');
  check(isString(slice),  'slice must be a string');

  check(reducer,             'reducer is required');
  check(isFunction(reducer), 'reducer must be a function');

  // auto generate a standard selector for our sliced state
  const nodeNames = slice.split('.');
  function getSlicedState(appState) {
    return nodeNames.reduce( (runningNode, nodeName) => runningNode[nodeName], appState );
  }

  // embellish/return the supplied reducer
  reducer.slice          = slice;
  reducer.getSlicedState = getSlicedState;
  return reducer;
}
