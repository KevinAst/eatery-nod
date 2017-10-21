import verify            from '../verify';
import isString          from 'lodash.isstring';
import isFunction        from 'lodash.isfunction';
import {isValidRouterCB} from './createRouterCB';


/**
 * Create a new Feature object, that accumulates various feature
 * aspects to be consumed by feature-u runApp().
 *
 * Example:
 * ```
 *   import {createFeature} from 'feature-u';
 *   import reducer         from './reducer';
 *   export default createFeature({
 *     name:       'views',
 *     enabled:    true,
 *     reducer:    shapedReducer(reducer, 'views.currentView'),
 *     ?? more

 *   };
 * ```
 *
 * @param {string} namedArgs.name the feature name, used in
 * programmatically delineating various features (ex: 'views').
 *
 * @param {boolean} [namedArgs.enabled=true] an indicator as to
 * whether this feature is enabled (true) or not (false).
 *
 * @param {reducerFn} [namedArgs.reducer] an optional reducer that
 * maintains redux state (if any) for this feature.  By default, the
 * state managed by this reducer will be injected at the top-level
 * state tree using the feature name, however this can be fully
 * defined using the shapedReducer() utility.
 *
 * @param {SelectorObject} [namedArgs.selectors] an optional set of
 * selectors to be publically promoted for this feature, through the
 * feature-u App object, promoting cross-communication between
 * features.
 *
 * Ex:
 * ```
 * selectors: {
 *   currentView: (appState) => appState.views.currentView, ?? isolate appstate.views in function
 *   deviceReady: (appState) => appState.device.status === 'READY',
 * }
 * ```
 *
 * Selectors are functions which abstract access to application state.
 * They are useful in decoupling specific knowledge about the internal
 * state representation.  
 *
 * Even though redux state is available globally, the interpretive
 * meaning of this state should be fronted through selectors (that
 * encapsolate business logic and interpret state shape).  This is
 * certainly true for externall state access (by other features), but
 * less so for internal feature access (IMHO).
 *
 * Promoted through feature-u App object:
 * ```
 *   app: {
 *     views: {  // feature name
 *       selectors: {
 *         deviceReady(appState) {...},
 *         etc.
 *       }
 *     }
 *   }
 * ```
 *
 * @param {Logic[]} [namedArgs.logic] an optional set of business
 * logic modules (if any) to be registered to redux-logic in support
 * of this feature.
 *
 * @param {RouterCB} [namedArgs.router] the optional router callback that
 * exposes feature-based Components based on appState.
 *
 * @return {Feature} a new Feature object (to be consumed by feature-u runApp()).
 */
export default function createFeature({name,
                                       enabled=true,
                                       reducer,
                                       selectors,
                                       logic,
                                       router,
                                       ...unknownArgs}={}) {

  // ***
  // *** validate parameters
  // ***

  const check = verify.prefix('createFeature() parameter violation: ');

  check(name,            'name is required');
  check(isString(name),  'name must be a string');

  check(enabled===true||enabled===false, 'enabled must be a boolean');

  if (reducer) {
    check(isFunction(reducer), 'reducer (when supplied) must be a function');
  }

  if (selectors) {
    // ? consider doing a lodash isPlainObject(selectors)
  }

  if (logic) {
    check(Array.isArray(logic), 'logic (when supplied) must be an array of redux-logic modules');
  }

  if (router) {
    const routerMsg = isValidRouterCB(router);
    check(!routerMsg, routerMsg);
  }

  const unknownArgKeys = Object.keys(unknownArgs);
  check(unknownArgKeys.length===0,  `unrecognized named parameter(s): ${unknownArgKeys}`);


  // ***
  // *** return a new Feature object, accumulating feature aspects
  // ***

  return {
    name,
    enabled,
    reducer,
    selectors,
    logic,
    router,
  };

}





//??????????????????????????????????????

//?   >>> KEY: ?? feature specific action creators.  Only requirement is each action creator function must be toString() overloaded to promote the action type.
//?               Each feature will typically need many actions, most of which can be considered an internal implementation detail to that feature.
//?               The only actions that are required here are those that require public access (i.e. cross-feature communication)
//?               Will be publically promoted for this feature, through the feature-u App object, promoting cross-communication between features.

//?   actions:    ??,  ?? unsure what needs to be communicated here (typically actions used in a feature are exclusively used internally)
//?                    ?? need a way to publically expose actions outside of feature
//? 
//?   ?? appWillStart: () => whatever, // arbitrary code that is executed one-time at app startup
//? 
//?   ?? appDidStart: ({getState, dispatch}) => whatever // optional code that executes once expo is fully setup (typically dispatches a 'bootstrap app' action)
//? 
//? 
//?   * ? log-u configuration ......... - ? many aspects of log configuration revolve around filter identies (federated namespaces)

