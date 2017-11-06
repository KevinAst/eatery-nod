import verify         from '../verify';
import isFunction     from 'lodash.isfunction';

/**
 * Mark the supplied function as a "callback injected with feature
 * context", distinguishing it from other functions (such as
 * reducer functions).
 *
 * Example (reducer):
 * ```
 *   export default injectContext( (feature, app) => combineReducers({...reducer-code-using-feature...} ) );
 * ```
 *
 * SideBar: For reducer aspects, when BOTH shapedReducer() and
 *          injectContext() are used, shapedReducer() should be
 *          adorned in the outer function passed to createFunction().
 *
 * Example (logic):
 * ```
 *   export const startAppAuthProcess = injectContext( (feature, app) => createLogic({
 *     ...logic-code-using-feature...
 *   }));
 * ```
 *
 * @param {function} contextCallback the callback function to be invoked
 * by feature-u with feature context, returning the appropriate
 * feature aspect.  The callback should conform to the following
 * signature:
 * ```
 *   contextCallback(feature, app): feature-aspect
 * ```
 *
 * @return {function} the supplied contextCallback, marked as "callback
 * injected with feature context".
 */
export default function injectContext(contextCallback) {

  // validate parameters
  const check = verify.prefix('injectContext() parameter violation: ');

  check(contextCallback,             'contextCallback is required');
  check(isFunction(contextCallback), 'contextCallback must be a function');

  // mark the supplied function as a "callback injected with feature context"
  // ... distinguishing it from other functions (such as reducers)
  contextCallback.injectContext = true;

  // that's all folks
  return contextCallback;
}
