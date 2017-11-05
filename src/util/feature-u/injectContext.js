import verify         from '../verify';
import isFunction     from 'lodash.isfunction';

/**
 * Mark the supplied function as a "callback injected with feature
 * context", distinguishing it from other functions (such as
 * reducer functions).
 *
 * Example (reducer):
 * ```
 *   export default injectContext( (feature) => combineReducers({...reducer-code-using-feature...} ) );
 * ```
 *
 * SideBar: For reducer aspects, when BOTH shapedReducer() and
 *          injectContext() are used, shapedReducer() should be
 *          adorned in the outer function passed to createFunction().
 *
 * Example (logic):
 * ```
 *   export const startAppAuthProcess = injectContext( (feature) => createLogic({
 *     ...logic-code-using-feature...
 *   }));
 * ```
 *
 * @param {function} callback the callback function to be invoked
 * by feature-u with feature context, returning the appropriate
 * feature aspect.  The callback should conform to the following
 * signature:
 * ```
 *   callback(feature): feature-aspect
 * ```
 *
 * @return {function} the supplied callback, marked as "callback
 * injected with feature context".
 */
export default function injectContext(callback) {

  // validate parameters
  const check = verify.prefix('injectContext() parameter violation: ');

  check(callback,             'callback is required');
  check(isFunction(callback), 'callback must be a function');

  // mark the supplied function as a "callback injected with feature context"
  // ... distinguishing it from other functions (such as reducers)
  callback.injectContext = true;

  // that's all folks
  return callback;
}
