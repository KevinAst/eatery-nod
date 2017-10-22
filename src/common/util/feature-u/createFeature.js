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
 * @param {Any} [namedArgs.crossFeature] an optional resource exposed
 * in app.{feature}.{crossFeature} (of runApp()), promoting
 * cross-communication between features.
 *
 * Many aspects of a feature are internal to the feature's
 * implementation.  For example, most actions are created and consumed
 * exclusively by logic/reducers that are internal to the feature.
 *
 * However, other aspects of a feature may need to be exposed, to
 * promote cross-communication between features.  For example,
 * featureB may need to know some aspect of featureB, such as some of
 * it's state (through a selector), or emit one of it's actions, or in
 * general anything (invoke some function that does xyz).
 *
 * This cross-communication is accomplished through the crossFeature.
 * This is an item of any type (typically an object) that is exposed
 * through the feature-u app (emitted from runApp(), and exported
 * through your app).
 *
 * You can think of crossFeature as your feature's public API.
 *
 * Here is a suggested sampling:
 * ```
 * name: 'foo',
 * crossFeature: {
 *
 *   // actions stimulate activity within our app
 *   // ... our actions are encapsulated as action creator functions
 *   //     that promote both creator and type (via toString() overload)
 *   // ... we expose JUST actions that needs public access (not all)
 *   actions: {
 *     open(): action,
 *     etc(),
 *   },
 *
 *   // selectors encapsulate state location (shape) and apply business logic (as needed)
 *   // ... we expose JUST state that needs public access (not all)
 *   selectors: {
 *     currentView: (appState) => appState.foo.currentView,
 *     deviceReady: (appState) => appState.foo.status === 'READY',
 *     etc(appState),
 *   },
 *   anyThingElseYouNeed() // etc, etc, etc
 * }
 * ```
 *
 * The above sample is exposed through the feature-u app, as follows:
 * ```
 *   import app from './your-app-import'; // an export of runApp()
 *   ...
 *   app.foo.selectors.currentView(appState)
 * ```
 *
 * Please note that if a feature can be disabled, the corresponding
 * app.{feature} will NOT exist.  External features can use this
 * aspect to dynamically determine if the feature is active or not.
 * ```
 *   import app from './your-app-import';
 *   ...
 *   if (app.foo) {
 *     do something foo related
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
 * @param {function} [namedArgs.appWillStart] an optional app
 * life-cycle method invoked one-time at app startup time.
 *
 * This life-cycle method can do any type of initialization, and/or
 * optionally supplement the app's top-level content (using a non-null
 * return).  
 *
 * ```
 *   API: appWillStart(app, children): optional-top-level-content (null for none)
 * ```
 *
 * Normally, this callback doesn't return anything (i.e. undefined).
 * However any return value is interpreted as the content to inject at
 * the top of the app (between the redux Provider and feature-u's
 * Router.  IMPORTANT: If you return top-level content, it is your
 * responsiblity to include the supplied children in your render.
 * Otherwise NO app content will be displayed (because children
 * contains the feature-u Router, which decides what screen to
 * display).
 *
 * Here is an example of injecting new root-level content:
 * ```
 * appWillStart(app, children) {
 *   ... other initialization ...
 *   return (
 *     <Drawer ...>
 *       {children}
 *     </Drawer>
 *   );
 * }
 * ```
 *
 * Here is an example of injecting a new sibling to children:
 * ```
 * appWillStart: (app, children) => [React.Children.toArray(children), <Notify/>]
 * ```
 *
 * @param {function} [namedArgs.appDidStart] an optional app
 * life-cycle method invoked one-time immediatly after app has started.
 * ```
 *   API: appDidStart({app, appState, dispatch}): void
 * ```
 *
 * @return {Feature} a new Feature object (to be consumed by feature-u runApp()).
 */
export default function createFeature({name,
                                       enabled=true,
                                       reducer,
                                       crossFeature,
                                       logic,
                                       router,
                                       appWillStart,
                                       appDidStart,
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

  // crossFeature: nothing to validate

  if (logic) {
    check(Array.isArray(logic), 'logic (when supplied) must be an array of redux-logic modules');
  }

  if (router) {
    const routerMsg = isValidRouterCB(router);
    check(!routerMsg, routerMsg);
  }

  if (appWillStart) {
    check(isFunction(appWillStart), 'appWillStart (when supplied) must be a function');
  }

  if (appDidStart) {
    check(isFunction(appDidStart), 'appDidStart (when supplied) must be a function');
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
    crossFeature,
    logic,
    router,
    appWillStart,
    appDidStart,
  };

}
