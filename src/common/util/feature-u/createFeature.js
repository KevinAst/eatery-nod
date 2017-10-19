// ?? check imports
import verify         from '../verify';
import isEqual        from 'lodash.isequal';
import isString       from 'lodash.isstring';
import isFunction     from 'lodash.isfunction';

/**
 * Create a new Feature object, that accumulates various feature
 * aspects to be consumed by runApp().
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

  *???   selectors:  ??,  for cross-communication between features (minimal need, because most access is internal)
  *???   * ? selectors (trimmed down) ....   * ? define via: stateRoot(appState) ... ex: currentView: (appState) => appState.views.currentView
  *???                                     - most state is internal/private (used within the feature)
  *???                                       ... public promotion (outside feature) is acomplished through selector definition
  *??? 


 *   };
 * ```
 *
 * @param {string} namedArgs.name the feature name, used in
 * programmatically delineating various features (ex: 'views').
 *
 * @param {boolean} [namedArgs.enabled=true] an indicator as to
 * whether this feature is enabled (true) or not (false).
 *
 * @param {reducerFn} [namedArgs.reducer] the optional reducer that
 * maintains redux state (if any) for this feature.  By default, the
 * state managed by this reducer will be injected at the top-level
 * state tree using the feature name, however this can be fully
 * defined using the shapedReducer() utility.
 *
 * @return {Feature} a new Feature object (as follows):
 * ```
 *  {
 *    ??? doc this
 *  }
 * ```
 */
export default function createFeature({name,
                                       enabled=true,
                                       reducer,
                                       //?? more here
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

  const unknownArgKeys = Object.keys(unknownArgs);
  check(unknownArgKeys.length===0,  `unrecognized named parameter(s): ${unknownArgKeys}`);


  // ***
  // *** return a new Feature object, accumulating feature aspects
  // ***

  return {
    name,
    enabled,
    reducer,
  };

}





//??????????????????????????????????????

//?   actions:    ??,  ?? unsure what needs to be communicated here (typically actions used in a feature are exclusively used internally)
//?                    ?? need a way to publically expose actions outside of feature
//? 
//?   * ? actions (action creators) ... - ROOTED in a single node (carving out a single root action-u ActionStructure)
//?                                       * ? define via: actionsRoot(actions) ... ex: changeView: actions.views.changeView
//?                                     - most actions are internal/private (used within the feature)
//?                                       ... consider how to promote public actions (KINDA LIKE how selectors decouple state location)
//?                                     - ???
//?                                           
//? 
//? 
//?   logic:      ??,
//?   * ? logic ....................... - simply a collection of logic modules (i.e. an array) to be registered
//?                                       * order of feature registration defines logic precedence (typically only needed in rare cases)
//? 
//?   router:     ??,
//?   * ? router ...................... - ? some registered API that is invoked at run-time to emit the correct components to render
//? 
//?   sideBar:    ??,
//?   * ? SideBar hooks ...............
//? 
//?   components: ??,  ?? unsure what needs to be communicated here (typically components used in a feature are exclusively used internally)
//?   * ? components .................. - ? components (called out by feature-u router) to execute feature functionality
//? 
//?   api:        ??,  ?? I kinda think of this as independent of features (ex: firebase) because it can be used by many features
//?                    ?? UNLESS we are referring to some feature api that we want to promote for cross-communication between features
//?   * ? api (may be more global) .... - hmmm I kinda think of this as independent of features
//? 
//?   appWillStart()
//?   initialization:  () => whatever, // arbitrary code that is executed one-time at app startup
//? 
//?                    ?? is this too much?
//?   appDidStart()
//?   kickStartApp:    ({getState, dispatch}) => whatever // optional code that executes once expo is fully setup (typically dispatches a 'bootstrap app' action)
//? 
//? 
//?   * ? log-u configuration ......... - ? many aspects of log configuration revolve around filter identies (federated namespaces)

