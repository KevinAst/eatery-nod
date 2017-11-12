import verify            from '../verify';
import isString          from 'lodash.isstring';
import isFunction        from 'lodash.isfunction';
import {isValidRoute}    from './createRoute';
import shapedReducer     from './shapedReducer';


/**
 * Create a new Feature object, that accumulates various feature
 * aspects to be consumed by feature-u runApp().
 *
 * Example:
 * ```
 *   import {createFeature} from 'feature-u';
 *   import reducer         from './state';
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
 * @param {Any|contextCallback} [namedArgs.publicAPI] an optional
 * resource exposed in app.{featureName}.{publicAPI} (emitted from
 * runApp()), promoting cross-communication between features.  Please
 * refer to the feature-u `Public API` documentation for more
 * detail.
 *
 * Because some publicAPI may require feature-based context
 * information, this parameter can also be a contextCallback - a
 * function that returns the publicAPI (see injectContext()).
 *
 * @param {reducerFn|contextCallback} [namedArgs.reducer] an optional
 * reducer that maintains redux state (if any) for this feature.
 * feature-u patches each reducer into the overall app state, by
 * default using the `feature.name`, but can be explicitly defined
 * through the shapedReducer() (embellishing the reducer with a shape
 * specification).  Please refer to the feature-u `Reducers`
 * documentation for more detail.
 *
 * Because some reducers may require feature-based context
 * information, this parameter can also be a contextCallback - a
 * function that returns the reducerFn (see injectContext()).
 *
 * @param {Logic[]|contextCallback} [namedArgs.logic] an optional set
 * of business logic modules (if any) to be registered to redux-logic
 * in support of this feature. Please refer to the feature-u `Logic`
 * documentation for more detail.
 *
 * Because some logic modules may require feature-based context
 * information, this parameter can also be a contextCallback - a
 * function that returns the Logic[] (see injectContext()).
 *
 * @param {Route} [namedArgs.route] the optional route callback (see
 * createRoute()) that promotes feature-based top-level screen
 * components based on appState.  Please refer to the feature-u
 * `routes` documentation for more detail.
 *
 * @param {function} [namedArgs.appWillStart] an optional app
 * life-cycle callback invoked one-time at app startup time. 
 *
 * This life-cycle callback can do any type of initialization, and/or
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
 * life-cycle callback invoked one-time immediatly after app has started.
 * ```
 *   API: appDidStart({app, appState, dispatch}): void
 * ```
 *
 * @return {Feature} a new Feature object (to be consumed by feature-u runApp()).
 */
export default function createFeature({name,
                                       enabled=true,

                                       publicAPI,

                                       reducer,
                                       logic,
                                       route,

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

  // publicAPI: nothing to validate (it can be anything, INCLUDING a .injectContext function)

  if (reducer) {
    check(isFunction(reducer) || reducer.injectContext, 'reducer (when supplied) must be a function -or- a contextCallback');

    // default reducer shape to our feature name
    if (!reducer.shape) {
      shapedReducer(reducer, name);
    }
  }

  if (logic) {
    check(Array.isArray(logic) || logic.injectContext, 'logic (when supplied) must be an array of redux-logic modules -or- a contextCallback');
  }

  if (route) {
    const routeMsg = isValidRoute(route);
    check(!routeMsg, routeMsg);
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

  // NOTES:
  //  *P*: we pre-register all "raw" feature aspects
  //  *E*: some of which may NOT yet be fully expanded
  //       ... ones that support (and use) the injectContext() callback wrapper
  //       ... this expansion is controlled by runApp() 
  //           to insure the publicAPI of ALL features are expanded FIRST,
  //           for other feature aspect expansion to use
  //  *D*: some aspects contain "digestible" info that can be used internally in 
  //       aspect expansion (for single-source-of-truth)
  return {
    name,          // *P* *D*
    enabled,       // *P* *D*

    publicAPI,     // *P* *D* *E* KEY: this aspect is the feature's public API

    reducer,       // *P* *D* *E* NOTE: digestible info for reducers (*D*) are simply reducer.getShapedState(appState)
    logic,         // *P*     *E*
    route,         // *P*

    appWillStart,  // *P*
    appDidStart,   // *P*
  };
}

/**
 * Expand the publicAPI aspect of the supplied feature, when it is
 * employing the injectContext() callback wrapper (see *E* above).
 * 
 * This is invoked by runApp() to insure the publicAPI of ALL features
 * are expanded FIRST, so that other feature aspect expansion can use
 * it.
 *
 * This eliminates order dependency issues related to feature
 * expansion - EVEN in code that is expanded in-line.  The only
 * exception to this is dependencies in the publicAPI itself (which
 * should be an anti-pattern).
 *
 * @param {Feature} feature the Feature object for which to expand the
 * publicAPI.
 *
 * @param {App} app the App object (emitted by runApp()).
 */
export function expandFeatureAspect_publicAPI(feature, app) {
  if (feature.publicAPI && feature.publicAPI.injectContext) {
    feature.publicAPI = feature.publicAPI(feature, app);
  }
}


/**
 * Expand all other aspects of the supplied feature, when they are
 * employing the injectContext() callback wrapper (see *E* above).
 * 
 * This is invoked by runApp() to insure the publicAPI of ALL features
 * are expanded BEFORE all other aspects, so that they can use the
 * publicAPI.
 *
 * This eliminates order dependency issues related to feature
 * expansion - EVEN in code that is expanded in-line.  The only
 * exception to this is dependencies in the publicAPI itself (which
 * should be an anti-pattern).
 *
 * @param {Feature} feature the Feature object for which to expand the
 * aspects.
 *
 * @param {App} app the App object (emitted by runApp()).
 */
export function expandFeatureAspects(feature, app) {

  // TODO: #reducerPartOfOtherFeature: here we expand the reducers
  //       - can we somehow do more?
  //       - like pass in un-attached reducers, 
  //       - giving other features the oppertunity to include them?
  // ... reducer
  if (feature.reducer && feature.reducer.injectContext) {

    // hold on to our reducer shape
    // ... we know shape is available, because WE default it (above)
    const shape = feature.reducer.shape;

    // fully resolve our actual reducer
    feature.reducer = feature.reducer(feature, app);

    // validate that no incompatable shape has been defined within our resolved reducer
    if (feature.reducer.shape) {
      verify(feature.reducer.shape === shape, `createFeature() parameter violation: reducer contextCallback shape: '${shape}' is different from resolved reducer shape: '${feature.reducer.shape}'.
SideBar: When BOTH shapedReducer() and injectContext() are needed, shapedReducer() should be adorned ONLY in the outer function passed to createFunction().`);
    }

    // apply same shape to our final resolved reducer
    // ... so feature.reducer.getShapedState(appState) is available for public access
    shapedReducer(feature.reducer, shape);
  }

  // ... logic
  if (feature.logic && feature.logic.injectContext) {
    feature.logic = feature.logic(feature, app);
  }

}
