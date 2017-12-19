import verify                    from '../verify';
import isString                  from 'lodash.isstring';
import isFunction                from 'lodash.isfunction';
import {isBuiltInFeatureKeyword} from './createFeature';

// our default no-op (the "identity" function)
const noOp = p => p;
 
/**
 * @function createAspect
 * @description
 *
 * Create an Aspect object, used to extend feature-u.
 *
 * **Note on App Promotion**: You will notice that the App object is
 * consistently supplied thoughout the various Aspect methods.  The
 * App object is used in promoting cross-communiction between
 * features.  While it is most likely an anti-pattern to interaget the
 * App object directly in the Aspect, it is needed as to "pass
 * through" to downwstream processes (i.e. as an opaque object).
 * **This is the reason the App object is supplied**.  As examples of
 * this:
 *  - The "logic" aspect will dependancy inject (DI) the App object
 *    into the redux-logic process.
 *  - The "route" aspect communcates the app in it's API (i.e. passes
 *    it through).
 *  - etc.
 *
 * **Please Note**: `createAspect()` accepts named parameters.
 *
 * @param {string} name the aspect name.  This name is used to "key"
 * aspects of this type in the Feature object: `Feature.{name}: xyz`.
 * As a result, Aspect names must be unique across all aspects that
 * are in-use.
 *
 * @param {validateFeatureContentFn} validateFeatureContent a
 * validation hook allowing this aspect to verify it's content on the
 * supplied feature (which is known to contain this aspect).
 *
 * @param {assembleFeatureContentFn} assembleFeatureContent the
 * required Aspect method that assembles content for this aspect
 * across all features, retaining needed state for subsequent ops.
 * This method is required because this is the primary task that is
 * accomplished by all aspects.
 *
 * @param {assembleAspectResourcesFn} [assembleAspectResources] an
 * optional Aspect method that assemble resources for this aspect
 * across all other aspects, retaining needed state for subsequent
 * ops.  This hook is executed after all the aspects have assembled
 * their feature content (i.e. after `assembleFeatureContent()`).
 *
 * @param {injectRootAppElmFn} [injectRootAppElm] an optional callback
 * hook that promotes some characteristic of this aspect within the
 * app root element (i.e. react component instance).
 * 
 * @param {Any} [additionalMethods] additional methods (proprietary to
 * specific Aspects), supporting two different requirements:
 * <ol>
 * <li> internal Aspect helper methods, and
 * <li> APIs used in "aspect cross-communication" ... a contract
 *      between one or more aspects.  This is merely an API specified
 *      by one Aspect, and used by another Aspect, that is facilitate
 *      through the `Aspect.assembleAspectResources(aspects, app)`
 *      hook.
 * </ol>
 *
 * @return {Aspect} a new Aspect object (to be consumed by launchApp()).
 */
export default function createAspect({name,
                                      validateFeatureContent,
                                      assembleFeatureContent,
                                      assembleAspectResources=noOp,
                                      injectRootAppElm=noOp,
                                      ...additionalMethods}={}) {

  // ***
  // *** validate parameters
  // ***

  const check = verify.prefix('createAspect() parameter violation: ');

  check(name,            'name is required');
  check(isString(name),  'name must be a string');
  check(!isBuiltInFeatureKeyword(name), `aspect name value: '${name}' is a reserved Feature keyword`);
  // NOTE: we validate Aspect.name uniqueness in launchApp() (once we know all aspects in-use)

  check(validateFeatureContent,              'validateFeatureContent is required');
  check(isFunction(validateFeatureContent),  'validateFeatureContent must be a function');

  check(assembleFeatureContent,              'assembleFeatureContent is required');
  check(isFunction(assembleFeatureContent),  'assembleFeatureContent must be a function');

  check(isFunction(assembleAspectResources), 'assembleAspectResources (when supplied) must be a function');

  check(isFunction(injectRootAppElm),        'injectRootAppElm (when supplied) must be a function');



  // ***
  // *** return our new Aspect object
  // ***

  return {
    name,
    validateFeatureContent,
    assembleFeatureContent,
    assembleAspectResources,
    injectRootAppElm,
    ...additionalMethods,
  };

}



//***
//*** Specification: validateFeatureContentFn
//***

/**
 * A validation hook allowing this aspect to verify it's content on
 * the supplied feature (which known to contain this aspect).
 *
 * @callback validateFeatureContentFn
 * 
 * @param {Feature} feature - the feature to validate, which is known
 * to contain this aspect.
 *
 * @return {string} an error message when the supplied feature
 * contains invalid content for this aspect (null when valid).
 */



//***
//*** Specification: assembleFeatureContentFn
//***

/**
 * The required Aspect method that assembles content for this aspect
 * across all features, retaining needed state for subsequent ops.
 * This method is required because this is the primary task that is
 * accomplished by all aspects.
 *
 * @callback assembleFeatureContentFn
 * 
 * @param {Feature[]} activeFeatures - The set of active (enabled)
 * features that comprise this application.
 *
 * @param {App} app the App object used in feature cross-communication.
 */



//***
//*** Specification: assembleAspectResourcesFn
//***

/**
 * An optional Aspect method that assemble resources for this aspect
 * across all other aspects, retaining needed state for subsequent
 * ops.  This hook is executed after all the aspects have assembled
 * their feature content (i.e. after `assembleFeatureContent()`).
 *
 * This is an optional second-pass (so-to-speak) of Aspect data
 * gathering, that facilitates an "aspect cross-communication"
 * mechanism.  It allows a given aspect to gather resources from other
 * aspects, through a documented API for a given Aspect (ex:
 * Aspect.getXyz()).
 * 
 * As an example of this, the "reducer" aspect (which manages redux),
 * allows other aspects to inject their own redux middleware (ex:
 * redux-logic), through it's documented Aspect.getReduxMiddleware()
 * API.
 *
 * @callback assembleAspectResourcesFn
 * 
 * @param {Aspect[]} aspects - The set of feature-u Aspect objects
 * used in this this application.
 *
 * @param {App} app the App object used in feature cross-communication.
 */



//***
//*** Specification: injectRootAppElmFn
//***

/**
 * An optional callback hook that promotes some characteristic of this
 * aspect within the app root element (i.e. react component instance).
 * 
 * All aspects will either promote themselves through this hook, -or-
 * through some "aspect cross-communication" mechanism.
 *
 * **NOTE**: When this hook is used, the supplied curRootAppElm MUST be
 * included as part of this definition!
 *
 * @callback injectRootAppElmFn
 * 
 * @param {reactElm} curRootAppElm - the current react app element root.
 *
 * @param {App} app the App object used in feature cross-communication.
 *
 * @return {reactElm} a new react app element root (which in turn must
 * contain the supplied curRootAppElm), or simply the supplied
 * curRootAppElm (if no change).
 */
