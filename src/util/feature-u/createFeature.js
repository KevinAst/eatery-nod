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
 *     ?? expand this a bit
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
 * @param {Any|contextCB} [publicFace] an optional
 * resource exposed in app.{featureName}.{publicFace} (emitted from
 * runApp()), promoting cross-communication between features.  Please
 * refer to the feature-u `publicFace` documentation for more
 * detail.
 *
 * Because some publicFace may require feature-based context
 * information, this parameter may also be a contextCB - a
 * function that returns the publicFace (see managedExpansion()).
 *
 * @param {reducerFn|contextCB} [reducer] an optional
 * reducer that maintains redux state (if any) for this feature.
 *
 * The reducers from all features are combined into one overall app
 * state, through a required shape specification, embellished on the
 * reducer through the shapedReducer() function.  Please refer to the
 * feature-u `Reducers` documentation for more detail.
 *
 * Because some reducers may require feature-based context
 * information, this parameter may also be a contextCB - a
 * function that returns the reducerFn (see managedExpansion()).
 *
 * @param {Logic[]|contextCB} [logic] an optional set
 * of business logic modules (if any) to be registered to redux-logic
 * in support of this feature. Please refer to the feature-u `Logic`
 * documentation for more detail.
 *
 * Because some logic modules may require feature-based context
 * information, this parameter may also be a contextCB - a
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

                                       publicFace,

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

  // publicFace: nothing to validate (it can be anything, INCLUDING a .managedExpansion function)

  if (reducer) {
    check(isFunction(reducer) || reducer.managedExpansion, 'reducer (when supplied) must be a function -or- a contextCB');

    check(reducer.shape, 'reducer (when supplied) must be embellished with shapedReducer(). SideBar: shapedReducer() should always wrap the the outer function passed to createFunction() (even when managedExpansion() is used).');
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
  //           to insure the publicFace of ALL features are expanded FIRST,
  //           for other feature aspect expansion to use
  //  *D*: some aspects contain "digestible" info that can be used internally in 
  //       aspect expansion (for single-source-of-truth)
  return {
    name,          // *P* *D*
    enabled,       // *P* *D*

    publicFace,    // *P* *D* *E* KEY: this aspect is the feature's public API

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
 * Expand the publicFace aspect of the supplied feature, when it is
 * employing the managedExpansion() callback wrapper (see *E* above).
 * 
 * This is invoked by runApp() to insure the publicFace of ALL features
 * are expanded FIRST, so that other feature aspect expansion can use
 * it.
 *
 * This eliminates order dependency issues related to feature
 * expansion - EVEN in code that is expanded in-line.  The only
 * exception to this is dependencies in the publicFace itself (which
 * should be an anti-pattern).
 *
 * @param {Feature} feature the Feature object for which to expand the
 * publicFace.
 *
 * @param {App} app the App object (emitted by runApp()).
 */
export function expandFeatureAspect_publicFace(feature, app) {
  if (feature.publicFace && feature.publicFace.managedExpansion) {
    // fully resolve the actual publicFace
    // ... by invoking the contextCB(app) embellished by managedExpansion(contextCB)
    feature.publicFace = feature.publicFace(app);
  }
}


/**
 * @private
 *
 * Expand all other aspects of the supplied feature, when they are
 * employing the managedExpansion() callback wrapper (see *E* above).
 * 
 * This is invoked by runApp() to insure the publicFace of ALL features
 * are expanded BEFORE all other aspects, so that they can use the
 * publicFace.
 *
 * This eliminates order dependency issues related to feature
 * expansion - EVEN in code that is expanded in-line.  The only
 * exception to this is dependencies in the publicFace itself (which
 * should be an anti-pattern).
 *
 * @param {Feature} feature the Feature object for which to expand the
 * aspects.
 *
 * @param {App} app the App object (emitted by runApp()).
 */
export function expandFeatureAspects(feature, app) {

  // reducer
  if (feature.reducer && feature.reducer.managedExpansion) {

    // hold on to our reducer shape
    // ... so as to apply it to our final resolved reducer (below)
    const shape = feature.reducer.shape;

    // fully resolve the actual reducer
    // ... by invoking the contextCB(app) embellished by managedExpansion(contextCB)
    feature.reducer = feature.reducer(app);

    // apply same shape to our final resolved reducer
    // ... so it is accessable to our internals (i.e. runApp)
    shapedReducer(shape, feature.reducer);
  }

  // logic
  if (feature.logic && feature.logic.managedExpansion) {
    // fully resolve the actual logic module
    // ... by invoking the contextCB(app) embellished by managedExpansion(contextCB)
    feature.logic = feature.logic(app);
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
