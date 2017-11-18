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
 * ?? eventually MOVE following words into User Guide:
 * 
 * In feature-u, you may communicate your FeatureAspects directly, or
 * through a contextCB.  There are two reasons you would use the latter:
 * 
 *  1. cross-feature communication (i.e. app object injection)
 * 
 *     There are cases where a given FeatureAspect needs resources
 *     from other features.  This is accomplished through the app
 *     object's promotion of the publicAPI for each feature.  This is
 *     especially useful when the resource is needed during the
 *     expansion of a FeatureAspect, because feature-u insures all
 *     publicAPI's are resolved prior to other aspects (removing any
 *     order dependency concerns).
 * 
 *  2. minimizing circular dependency issues (of ES6 modules)
 *
 *     There are cases where circular dependencies of ES6 modules are
 *     unavoidable.  Depending on the specifics, this is not
 *     universally bad design - rather one of packaging.
 *
 *     managedExpansion() aids in this process by delaying the
 *     expansion of non-digestible resources until they are absolutely
 *     needed.
 *
 *     As an example, reducers are typically packaged together with
 *     selectors.  There are cases where a selector may be referenced
 *     as part of the expansion of another resource, potentially
 *     causing unresolved references in the expansion of the reducer
 *     (say for example, action references).  This can be alleviated by
 *     delaying the expansion of the reducer, till it is absolutely
 *     needed (i.e. at redux configuration time, controlled by
 *     feature-u's runApp()).
 *
 * The contextCB function should conform to the following signature:
 *
 * ```js
 * contextCB(feature, app): FeatureAspect
 * ```
 *
 * Example (reducer):
 * ```js
 *   export default managedExpansion( (feature, app) => combineReducers({...reducer-code-using-app...} ) );
 * ```
 *
 * SideBar: For reducer aspects, when BOTH shapedReducer() and
 *          managedExpansion() are used, shapedReducer() should be
 *          adorned in the outer function passed to createFunction().
 *
 * Example (logic):
 * ```js
 *   export const startAppAuthProcess = managedExpansion( (feature, app) => createLogic({
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
 * publicAPI of each feature.
 * 
 * @returns {FeatureAspect} The desired FeatureAspect (ex: reducer,
 * logic module, etc.).
 */
