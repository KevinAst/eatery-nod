import verify            from '../verify';
import isString          from 'lodash.isstring';
import isFunction        from 'lodash.isfunction';

// our default no-op function
const noOp = () => null;

/**
 * @function createFeature
 * @description
 *
 * Create a new Feature object, accumulating Aspect content to be consumed
 * by launchApp().
 *
 * **Please Note** `createFeature()` accepts named parameters.
 *
 * @param {string} name the feature name, used in
 * programmatically delineating various features (ex: 'views').
 *
 * @param {boolean} [enabled=true] an indicator as to
 * whether this feature is enabled (true) or not (false).
 *
 * @param {Any} [publicFace] an optional resource exposed in
 * app.{featureName}.{publicFace} (emitted from launchApp()),
 * promoting cross-communication between features.  Please refer to
 * the feature-u `publicFace` documentation for more detail.
 *
 * @param {appWillStartFn} [appWillStart] an optional app life-cycle
 * hook invoked one-time at app startup time.  This life-cycle hook
 * can do any type of initialization, and/or optionally supplement the
 * app's top-level content (using a non-null return).  Please refer to
 * the feature-u `App Life Cycle Hooks` documentation for more detail.
 *
 * @param {appDidStartFn} [appDidStart] an optional app life-cycle
 * hook invoked one-time immediately after app has started.  Because
 * the app is up-and-running at this time, you have access to the
 * appState and the dispatch() function ... assuming you are using
 * redux (when detected by feature-u's plugable aspects).  Please
 * refer to the feature-u `App Life Cycle Hooks` documentation for
 * more detail.
 * 
 * @param {Aspect} [pluggableAspects] additional aspects, as defined
 * by the feature-u's pluggable Aspect extension.
 *
 * @return {Feature} a new Feature object (to be consumed by feature-u
 * launchApp()).
 */
export default function createFeature({name,
                                       enabled=true,

                                       publicFace={},

                                       appWillStart=noOp,
                                       appDidStart=noOp,

                                       ...pluggableAspects}={}) {

  // validate createFeature() parameters
  const check = verify.prefix('createFeature() parameter violation: ');

  // ... name
  check(name,            'name is required');
  check(isString(name),  'name must be a string');

  // ... enabled
  check(enabled===true || enabled===false, 'enabled must be a boolean');

  // ... publicFace: nothing to validate (it can be anything, INCLUDING a .managedExpansion function)

  // ... appWillStart
  check(isFunction(appWillStart), 'appWillStart (when supplied) must be a function');

  // ... appDidStart
  check(isFunction(appDidStart), 'appDidStart (when supplied) must be a function');

  // ... pluggableAspects
  //     ... this validation occurs by the Aspect itself (via launchApp())

  // create/return our new Feature object
  return {
    name,
    enabled,

    publicFace,

    appWillStart,
    appDidStart,

    ...pluggableAspects,
  };
}

// ?? must be var ?? I think this was causing problems at run-time ?? once running, make this a const to see if it is OK
var builtInFeatureKeywords = {
  name:         'name',
  enabled:      'enabled',
  publicFace:   'publicFace',
  appWillStart: 'appWillStart',
  appDidStart:  'appDidStart',
};

/**
 * @private
 * 
 * Return indicator as to whether the supplied propName is a built-in
 * Feature keyword.
 *
 * @param {string} propName the property name to check.
 *
 * @param {boolean} true: is keyword, false: is NOT keyword
 */
export function isBuiltInFeatureKeyword(propName) {
  return builtInFeatureKeywords[propName] ? true : false;
}


//***
//*** Specification: appWillStartFn
//***

/**
 * An optional app life-cycle hook invoked one-time at app startup
 * time.
 *
 * This life-cycle hook can do any type of initialization. For
 * example: initialize FireBase.
 *
 * In addition, this life-cycle hook can optionally supplement the
 * app's top-level content (using a non-null return). Typically,
 * nothing is returned (i.e. falsy). However any return value is
 * interpreted as the content to inject at the top of the app, between
 * the redux Provider and feature-u's Router.  **IMPORTANT**: If you
 * return top-level content, the supplied curRootAppElm MUST be
 * included as part of this definition (this accommodates the
 * accumulative process of other feature injections)!
 *
 * @callback appWillStartFn
 * 
 * @param {App} app the App object used in feature cross-communication.
 * 
 * @param {reactElm} curRootAppElm - the current react app element
 * root.
 *
 * @return {reactElm} optionally, new top-level content (which in turn
 * must contain the supplied curRootAppElm), or falsy for unchanged.
 */


//***
//*** Specification: appDidStartFn
//***

/**
 * An optional app life-cycle hook invoked one-time immediately after
 * app has started.
 *
 * Because the app is up-and-running at this time, you have access to
 * the appState and dispatch() function ... assuming you are using
 * redux (when detected by feature-u's plugable aspects).
 *
 * **Please Note** `appDidStart()` utilizes named parameters.
 *
 * @callback appDidStartFn
 * 
 * @param {App} app the App object used in feature cross-communication.
 * 
 * @param {Any} [appState] - the redux top-level app state (when redux
 * is in use).
 * 
 * @param {function} [dispatch] - the redux dispatch() function (when
 * redux is in use).
 */
