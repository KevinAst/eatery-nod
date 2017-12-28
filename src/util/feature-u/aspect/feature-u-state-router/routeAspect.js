import createAspect    from '../../createAspect'; // ?? EVENTUALLY peerDependency: import {createAspect} from 'feature-u';
import {isValidRoute}  from './createRoute';
import StateRouter     from './StateRouter';

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
 *     of your features that maintain routes_) referencing a route 
 *     defined by `createRoute()`.
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
  return isValidRoute(content);
}


/**
 * Accumulate all routes from our features.
 * 
 * @param {Feature[]} activeFeatures - The set of active (enabled)
 * features that comprise this application.
 *
 * @param {App} app the App object used in feature cross-communication.
 *
 * @private
 */
function assembleFeatureContent(activeFeatures, app) {

  // accumulate all routes from our features
  const routes = activeFeatures.reduce( (accum, feature) => {
    if (feature[this.name]) {
      // console.log(`xx acumulating route for ${feature.name}`);
      accum.push( feature[this.name] );
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
 * @param {reactElm} curRootAppElm - the current react app element root.
 *
 * @param {App} app the App object used in feature cross-communication.
 *
 * @return {reactElm} our StateRouter element.
 *
 * @private
 */
function injectRootAppElm(curRootAppElm, app) {
  // insure we don't clober any supplied content
  // ... by design, <StateRouter> doesn't support children
  if (curRootAppElm) {
    throw new Error('*** ERROR*** Please register feature-u-state-router Aspect before other Aspects ' +
                    'that inject content in the root app elm ... <StateRouter> does NOT support children.');
  }

  // inject our StateRouter component at the root app element.
  return <StateRouter app={app}
                      routes={this.routes}
                      fallbackElm={this.fallbackElm}
                      componentWillUpdateHook={this.componentWillUpdateHook}/>;
}
