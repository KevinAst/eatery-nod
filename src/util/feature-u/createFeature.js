import verify            from '../verify';
import isString          from 'lodash.isstring';
import isFunction        from 'lodash.isfunction';
import {isValidRoute}    from './createRoute';
import shapedReducer     from './shapedReducer';


/**
 * @function createFeature
 * @description
 *
 * Create a new Feature object, that accumulates various 
 * FeatureAspects to be consumed by feature-u runApp().
 *
 * Example:
 * ```js
 *   import {createFeature} from 'feature-u';
 *   import reducer         from './state';
 *   export default createFeature({
 *     name:       'views',
 *     enabled:    true,
 *     reducer:    shapedReducer('views.currentView', reducer),
 *     ? more
 *   };
 * ```
 *
 * **Please Note** `createFeature()` accepts named parameters.
 *
 * @param {string} name the feature name, used in
 * programmatically delineating various features (ex: 'views').
 *
 * @param {boolean} [enabled=true] an indicator as to
 * whether this feature is enabled (true) or not (false).
 *
 * @param {Any|contextCB} [publicAPI] an optional
 * resource exposed in app.{featureName}.{publicAPI} (emitted from
 * runApp()), promoting cross-communication between features.  Please
 * refer to the feature-u `Public API` documentation for more
 * detail.
 *
 * Because some publicAPI may require feature-based context
 * information, this parameter can also be a contextCB - a
 * function that returns the publicAPI (see managedExpansion()).
 *
 * @param {reducerFn|contextCB} [reducer] an optional
 * reducer that maintains redux state (if any) for this feature.
 * feature-u patches each reducer into the overall app state, by
 * default using the `feature.name`, but can be explicitly defined
 * through the shapedReducer() (embellishing the reducer with a shape
 * specification).  Please refer to the feature-u `Reducers`
 * documentation for more detail.
 *
 * Because some reducers may require feature-based context
 * information, this parameter can also be a contextCB - a
 * function that returns the reducerFn (see managedExpansion()).
 *
 * @param {Logic[]|contextCB} [logic] an optional set
 * of business logic modules (if any) to be registered to redux-logic
 * in support of this feature. Please refer to the feature-u `Logic`
 * documentation for more detail.
 *
 * Because some logic modules may require feature-based context
 * information, this parameter can also be a contextCB - a
 * function that returns the Logic[] (see managedExpansion()).
 *
 * @param {Route} [route] the optional route callback (see
 * createRoute()) that promotes feature-based top-level screen
 * components based on appState.  Please refer to the feature-u
 * `routes` documentation for more detail.
 *
 * @param {function} [appWillStart] an optional app life-cycle hook
 * invoked one-time at app startup time.  `API: appWillStart(app,
 * children): optional-top-level-content` This life-cycle hook can do
 * any type of initialization, and/or optionally supplement the app's
 * top-level content (using a non-null return).  Please refer to the
 * feature-u `App Life Cycle Hooks` documentation for more detail.
 *
 * @param {function} [appDidStart] an optional app life-cycle hook
 * invoked one-time immediately after app has started.  `API:
 * appDidStart({app, appState, dispatch}): void` Because the app is
 * up-and-running at this time, you have access to the appState and
 * the dispatch function.  Please refer to the feature-u `App Life
 * Cycle Hooks` documentation for more detail.
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

  // publicAPI: nothing to validate (it can be anything, INCLUDING a .managedExpansion function)

  if (reducer) {
    check(isFunction(reducer) || reducer.managedExpansion, 'reducer (when supplied) must be a function -or- a contextCB');

    // default reducer shape to our feature name
    if (!reducer.shape) {
      shapedReducer(name, reducer);
    }
  }

  if (logic) {
    check(Array.isArray(logic) || logic.managedExpansion, 'logic (when supplied) must be an array of redux-logic modules -or- a contextCB');
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
  //       ... ones that support (and use) the managedExpansion() callback wrapper
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
 * @private
 * 
 * Expand the publicAPI aspect of the supplied feature, when it is
 * employing the managedExpansion() callback wrapper (see *E* above).
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
  if (feature.publicAPI && feature.publicAPI.managedExpansion) {
    feature.publicAPI = feature.publicAPI(feature, app);
  }
}


/**
 * @private
 *
 * Expand all other aspects of the supplied feature, when they are
 * employing the managedExpansion() callback wrapper (see *E* above).
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
  if (feature.reducer && feature.reducer.managedExpansion) {

    // TODO: unsure, but this complexity may be removed if runApp() can retain shape before resolution ... because now the getShapedState() WILL BE a completly an internal detail of each feature

    // hold on to our reducer shape
    // ... we know shape is available, because WE default it (above)
    const shape = feature.reducer.shape;

    // fully resolve our actual reducer
    feature.reducer = feature.reducer(feature, app);

    // validate that no incompatable shape has been defined within our resolved reducer
    if (feature.reducer.shape) {
      verify(feature.reducer.shape === shape, `createFeature() parameter violation: reducer contextCB shape: '${shape}' is different from resolved reducer shape: '${feature.reducer.shape}'.
SideBar: When BOTH shapedReducer() and managedExpansion() are needed, shapedReducer() should be adorned ONLY in the outer function passed to createFunction().`);
    }

    // apply same shape to our final resolved reducer
    // ... so feature.reducer.getShapedState(appState) is available for public access
    shapedReducer(shape, feature.reducer);
  }

  // ... logic
  if (feature.logic && feature.logic.managedExpansion) {
    feature.logic = feature.logic(feature, app);
  }

}


//***
//*** Specification: FeatureAspect
//***

/**
 * @typedef {*} FeatureAspect
 * 
 * In feature-u, "aspects" (FeatureAspect) is a general term used to refer to the
 * various ingredients that, when combined, constitute your app. 
 * 
 * A FeatureAspect can refere to actions, reducers, components,
 * routes, logic, etc.
 */
