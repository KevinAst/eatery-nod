import verify            from '../verify';
import isString          from 'lodash.isstring';
import isFunction        from 'lodash.isfunction';
import {isValidRouterCB} from './createRouterCB';
import shapedReducer     from './shapedReducer';


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
 *     ? more

 *   };
 * ```
 *
 * @param {string} namedArgs.name the feature name, used in
 * programmatically delineating various features (ex: 'views').
 *
 * @param {boolean} [namedArgs.enabled=true] an indicator as to
 * whether this feature is enabled (true) or not (false).
 *
 * @param {Any|contextCallbackFn} [namedArgs.crossFeature] an optional
 * resource exposed in app.{feature}.{crossFeature} (emitted from
 * runApp()), promoting cross-communication between features.
 *
 * Many aspects of a feature are internal to the feature's
 * implementation.  For example, most actions are created and consumed
 * exclusively by logic/reducers that are internal to the feature.
 *
 * However, other aspects of a feature may need to be exposed, to
 * promote cross-communication between features.  For example,
 * feature-a may need to know some aspect of feature-b, such as some of
 * it's state (through a selector), or emit one of it's actions, or in
 * general anything (ex: invoke some function that does xyz).
 *
 * This cross-communication is accomplished through the crossFeature.
 * This is an item of any type (typically an object) that is exposed
 * through the feature-u app (emitted from runApp(), and exported
 * through your app.js).
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
 *     open: actions.view.open, // NOTE: strongly suspect NOT available in app during in-line execution - for MONITORING code (figure this out when we come to it)
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
 *   api: {
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
 * Because some crossFeature may require feature-based context
 * information, this parameter can also be a contextCallbackFn - a
 * callback that returns the crossFeature (see injectContext()).
 *
 * @param {reducerFn|contextCallbackFn} [namedArgs.reducer] an
 * optional reducer that maintains redux state (if any) for this
 * feature.  By default, the state managed by any supplied reducer
 * will be injected at the top-level state tree using the feature
 * name, however this can be fully defined using the shapedReducer()
 * utility.  Please note that createFeature() automatically insures
 * all reducers are embellished with shapedReducer() (i.e. a stake in
 * the ground) ... so you can rely on:
 * reducer.getShapedState(appState) to ALWAYS be available!
 *
 * Because some reducers may require feature-based context
 * information, this parameter can also be a contextCallbackFn - a
 * callback that returns the reducerFn (see injectContext()).
 *
 * @param {Logic[]|contextCallbackFn} [namedArgs.logic] an optional set of business
 * logic modules (if any) to be registered to redux-logic in support
 * of this feature.
 *
 * Because some logic modules may require feature-based context
 * information, this parameter can also be a contextCallbackFn - a
 * callback that returns the Logic[] (see injectContext()).
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
 * appWillStart: (app, children) => [React.Children.toArray(children), <Notify key="Notify"/>]
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

                                       crossFeature,

                                       reducer,
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

  // crossFeature: nothing to validate (it can be anything, INCLUDING a .injectContext function)

  if (reducer) {
    check(isFunction(reducer) || reducer.injectContext, 'reducer (when supplied) must be a function -or- a contextCallbackFn');

    // default reducer shape to our feature name
    if (!reducer.shape) {
      shapedReducer(reducer, name);
    }
  }

  if (logic) {
    check(Array.isArray(logic) || logic.injectContext, 'logic (when supplied) must be an array of redux-logic modules -or- a contextCallbackFn');
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
  // *** establish a new Feature object which accumulates feature aspects
  // ***

  // create new Feature object, accumulating all feature aspects
  // NOTES:
  //   *1*: we pre-register all "raw" aspects
  //        ... regardless of whether they are fully expanded (via injectContext())
  //   *2*: some aspects contain "digestible" info that can potentially be used
  //        in the expansion of other aspects (via injectContext())
  //   *3*: some aspects may NOT yet be fully expanded
  //        ... ones that support (and use) the injectContext() callback wrapper
  const feature = {

    name,          // *1* *2*
    enabled,       // *1* *2*

    crossFeature,  // *1* *2* *3* KEY: this aspect is the feature's public API   ??NO: , and is fully expanded out-of-the-box

    reducer,       // *1* *2* *3* NOTE: for reducer, digestible info (*2*) is simply reducer.getShapedState(appState)
    logic,         // *1*     *3*
    router,        // *1*

    appWillStart,  // *1*
    appDidStart,   // *1*
  };

  // now fully expand aspects supporting (and using) the injectContext() callback wrapper
  // ... injecting feature context in their expansion (see *3* above)

  // ... crossFeature
  //     NOTE: when pulled into runApp(), the crossFeature is resolved for ALL features, prior to any other feature aspect expansion
  //           - making the public API of ALL features available for the expansion of ALL feature aspects
  //           - eliminating order dependancy (with the exception of dependancies in the crossFeature itself - which should be an anti-pattern)
  if (feature.crossFeature && feature.crossFeature.injectContext) {
    feature.crossFeature = feature.crossFeature(feature);
  }

  // ... reducer
  if (feature.reducer && feature.reducer.injectContext) {

    // hold on to our reducer shape
    // ... we know shape is available, because WE default it (above)
    const shape = feature.reducer.shape;

    // fully resolve our actual reducer
    feature.reducer = feature.reducer(feature);

    // validate that no incompatable shape has been defined within our resolved reducer
    if (feature.reducer.shape) {
      check(feature.reducer.shape === shape, `reducer contextCallbackFn shape: '${shape}' is different from resolved reducer shape: '${feature.reducer.shape}'.
SideBar: When BOTH shapedReducer() and injectContext() are needed, shapedReducer() should be adorned ONLY in the outer function passed to createFunction().`);
    }

    // apply same shape to our final resolved reducer
    // ... so feature.reducer.getShapedState(appState) is available for public access
    shapedReducer(feature.reducer, shape);
  }

  // ... logic
  if (feature.logic && feature.logic.injectContext) {
    feature.logic = feature.logic(feature);
  }


  // ***
  // *** return our new Feature object
  // ***

  return feature;

}
