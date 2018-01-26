import React                      from 'react';  // ?? peerDependencies
import {createAspect,
        addBuiltInFeatureKeyword} from '../../'; // ?? peerDependencies: 'feature-u'
import StateRouter                from './StateRouter';
import isFunction                 from 'lodash.isfunction';

/**
 * @typedef {Aspect} routeAspect
 * 
 * The routeAspect is a **feature-u** plugin that facilitates StateRouter
 * integration to your features.
 * 
 * To use this aspect:
 * 
 *  1. Configure the `routeAspect.fallbackElm` representing a
 *     SplashScreen (of sorts) when no routes are in effect.
 *
 *  2. Register `routeAspect` as one of your aspects to
 *     **feature-u**'s `launchApp()`.
 *  
 *  3. Specify a `route` `createFeature()` named parameter (_in any
 *     of your features that maintain routes_) referencing a routeCB
 *     or routeCB[] defined by `featureRoute()`.
 * 
 * **Please refer to the User Docs** for a complete description with
 * examples.
 */
export default createAspect({
  name: 'route',
  validateConfiguration,
  validateFeatureContent,
  assembleFeatureContent,
  injectRootAppElm,
});


// register our OWN Feature API: injectRootAppElmForStateRouter(app, curRootAppElm): newRootAppElm
addBuiltInFeatureKeyword('injectRootAppElmForStateRouter');


/**
 * Validate self's required configuration.
 *
 * NOTE: To better understand the context in which any returned
 *       validation messages are used, feature-u will prefix them
 *       with: 'launchApp() parameter violation: '
 *
 * @return {string} an error message when self is in an invalid state
 * (falsy when valid).
 *
 * @private
 */
function validateConfiguration() {
  return this.fallbackElm ? null : `the ${this.name} aspect requires fallbackElm to be configured (at run-time)!`;
}


/**
 * Validate self's aspect content on supplied feature.
 *
 * NOTE: To better understand the context in which any returned
 *       validation messages are used, **feature-u** will prefix them
 *       with: 'createFeature() parameter violation: '
 *
 * @param {Feature} feature - the feature to validate, which is known
 * to contain this aspect.
 *
 * @return {string} an error message when the supplied feature
 * contains invalid content for this aspect (null when valid).
 *
 * @private
 */
function validateFeatureContent(feature) {
  const content = feature[this.name];
  const errMsg  = `${this.name} (when supplied) must be a routeCB or routeCB[] emitted from featureRoute()`;

  if (Array.isArray(content)) {
    for (const routeCB of content) {
      if ( !isValid(routeCB) ) {
        return errMsg;
      }
    }
  }
  else if ( !isValid(content) ) {
    return errMsg;
  }
  else {
    return null; // valid
  }
}

function isValid(routeCB) {
  if (! isFunction(routeCB)) {
    return false; // must be a function
  }
  else if ( ! Number.isInteger(routeCB.routePriority) ) {
    return false; // must be emitted from featureRoute()
  }
  else return true; // valid
}


/**
 * Accumulate all routes from our features.
 *
 * @param {App} app the App object used in feature cross-communication.
 * 
 * @param {Feature[]} activeFeatures - The set of active (enabled)
 * features that comprise this application.
 *
 * @private
 */
function assembleFeatureContent(app, activeFeatures) {

  // accumulate all routes from our features
  // ... also embellish each route with the featureName for diagnostic purposes
  const routes = activeFeatures.reduce( (accum, feature) => {
    const routeContent = feature[this.name];
    if (routeContent) {
      // console.log(`xx acumulating route for ${feature.name}`);
      if (Array.isArray(routeContent)) {
        accum.push(...routeContent);
        routeContent.forEach( route => route.featureName = feature.name );
      }
      else {
        accum.push(routeContent);
        routeContent.featureName = feature.name;
      }
    }
    return accum;
  }, []);
  // console.log(`xx routes: `, routes);

  // ?? how should NO routes be handled: silenty ignore, OR throw error?

  // retain for later use
  this.routes = routes;
}


/**
 * Inject our StateRouter component at the root app element.
 *
 * @param {App} app the App object used in feature cross-communication.
 * 
 * @param {Feature[]} activeFeatures - The set of active (enabled)
 * features that comprise this application.  This can be used in an
 * optional Aspect/Feature cross-communication.  As an example, an Xyz
 * Aspect may define a Feature API by which a Feature can inject DOM
 * in conjunction with the Xyz Aspect DOM injection.
 * 
 * @param {reactElm} curRootAppElm - the current react app element root.
 *
 * @return {reactElm} our StateRouter element.
 *
 * @private
 */
function injectRootAppElm(app, activeFeatures, curRootAppElm) {
  // insure we don't clober any supplied content
  // ... by design, <StateRouter> doesn't support children
  if (curRootAppElm) {
    throw new Error('*** ERROR*** Please register routeAspect (from feature-router) before other Aspects ' +
                    'that inject content in the root app elm ... <StateRouter> does NOT support children.');
  }

  // seed our routerRootAppElm with our StateRouter
  let routerRootAppElm = <StateRouter routes={this.routes}
                                      fallbackElm={this.fallbackElm}
                                      componentWillUpdateHook={this.componentWillUpdateHook}
                                      namedDependencies={{app}}/>;

  // allow features to suplement this top-level router
  // ... through our OWN Feature API: injectRootAppElmForStateRouter(app, curRootAppElm): newRootAppElm
  routerRootAppElm = activeFeatures.reduce( (cur_routerRootAppElm, feature) => {
    if (feature.injectRootAppElmForStateRouter) {
      return feature.injectRootAppElmForStateRouter(app, cur_routerRootAppElm);
    }
    else {
      return cur_routerRootAppElm;
    }
  }, routerRootAppElm );

  // that's all folks
  return routerRootAppElm;
}
