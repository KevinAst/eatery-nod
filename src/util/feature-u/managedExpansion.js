import verify         from '../verify';
import isFunction     from 'lodash.isfunction';

/**
 * @function managedExpansion
 * @description
 *
 * Mark the supplied contextCB as a "managed expansion callback",
 * distinguishing it from other functions (such as reducer functions).
 *
 * Managed Expansion Callbacks (i.e. contextCB) are merely functions
 * that when invoked, return a FeatureAspect (ex: reducer, logic
 * module, etc.).  In feature-u, you may communicate your
 * FeatureAspects directly, or through a contextCB.  The latter 1:
 * supports cross-feature communication (through app object
 * injection), and 2: minimizes circular dependency issues (of ES6
 * modules).  Please see the full User Guide for more details on this
 * topic.
 *
 * The contextCB function should conform to the following signature:
 *
 * ```js
 * contextCB(app): FeatureAspect
 * ```
 *
 * Example (reducer):
 * ```js
 *   export default shapedReducer('foo', managedExpansion( (app) => combineReducers({...reducer-code-using-app...} ) ));
 * ```
 *
 * SideBar: For reducer aspects, shapedReducer() should always wrap
 *          the the outer function passed to createFunction(), even
 *          when managedExpansion() is used.
 *
 * Example (logic):
 * ```js
 *   export const startAppAuthProcess = managedExpansion( (app) => createLogic({
 *     ...logic-code-using-app...
 *   }));
 * ```
 *
 * Please refer to the feature-u `managedExpansion()` documentation for more detail.
 *
 * @param {contextCB} contextCB the callback function that when invoked
 * (by feature-u) expands/returns the desired FeatureAspect.
 *
 * @return {contextCB} the supplied contextCB, marked as a "managed
 * expansion callback".
 */
export default function managedExpansion(contextCB) {

  // validate parameters
  const check = verify.prefix('managedExpansion() parameter violation: ');

  check(contextCB,             'contextCB is required');
  check(isFunction(contextCB), 'contextCB must be a function');

  // mark the supplied function as a "managed expansion callback"
  // ... distinguishing it from other functions (such as reducers)
  contextCB.managedExpansion = true;

  // that's all folks
  return contextCB;
}


//***
//*** Specification: contextCB
//***

/**
 * A "managed expansion callback" (defined by managedExpansion) that
 * when invoked (by feature-u) expands and returns the desired
 * FeatureAspect.
 *
 * @callback contextCB
 * 
 * @param {App} app - The feature-u app object, promoting the
 * publicFace of each feature.
 * 
 * @returns {FeatureAspect} The desired FeatureAspect (ex: reducer,
 * logic module, etc.).
 */
