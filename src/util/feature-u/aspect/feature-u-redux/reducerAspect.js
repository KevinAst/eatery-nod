import React              from 'react';              // ?? EVENTUALLY peerDependency
import {applyMiddleware,
        compose,
        createStore,
        combineReducers}  from 'redux';              // ?? EVENTUALLY peerDependency
import {Provider}         from 'react-redux';        // ?? EVENTUALLY peerDependency
import createAspect       from '../../createAspect'; // ?? EVENTUALLY peerDependency: import {createAspect} from 'feature-u';
import slicedReducer      from './slicedReducer';
import isFunction         from 'lodash.isfunction';

/**
 * @typedef {Aspect} reducerAspect
 * 
 * The reducerAspect is a **feature-u** plugin that facilitates redux
 * integration to your features.
 * 
 * To use this aspect:
 * 
 *  1. Register it as one of your aspects to **feature-u**'s `launchApp()`.
 *  
 *  2. Specify a `reducer` `createFeature()` named parameter (_in any
 *     of your features that maintain state_) referencing the reducer
 *     function that manages the feature state.
 *  
 *     Because your feature state is combined into one overall
 *     appState (for all features), the reducer must identify it's
 *     root location, through the `slicedReducer()` function.
 * 
 * **Please refer to the User Docs** for a complete description with
 * examples.
 */
export default createAspect({
  name: 'reducer', // to fully manage all of redux, we ONLY need the reducers (hence our name)!
  expandFeatureContent,
  validateFeatureContent,
  assembleFeatureContent,
  assembleAspectResources,
  getReduxStore,
  injectRootAppElm,
});


/**
 * Expand the reducer content in the supplied feature -AND- transfer
 * the slice property from the expansion function to the expanded
 * reducer.
 * 
 * @param {Feature} feature - the feature which is known to contain
 * this aspect **and** is in need of expansion (as defined by
 * managedExpansion()).
 *
 * @param {App} app the App object used in feature
 * cross-communication.
 *
 * @return {string} an optional error message when the supplied
 * feature contains invalid content for this aspect (falsy when
 * valid).  This is a specialized validation of the expansion
 * function, over-and-above what is checked in the standard
 * validateFeatureContent() hook.
 */
function expandFeatureContent(feature, app) {
  // hold on to our reducer slice
  // ... so as to apply it to our final resolved reducer (below)
  const slice = feature.reducer.slice;

  // insure the slice is defined
  if (!slice) {
    return `${this.name} (when supplied) must be embellished with slicedReducer(). SideBar: slicedReducer() should always wrap the the outer function passed to createFunction() (even when managedExpansion() is used).`;
  }

  // expand self's content in the supplied feature
  // ... by invoking the contextCB(app) embellished by managedExpansion(contextCB)
  feature[this.name] = feature[this.name](app);

  // apply same slice to our final resolved reducer
  // ... so it is accessable to our internals (i.e. launchApp)
  slicedReducer(slice, feature[this.name]);
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
  return isFunction(content)
           ? ( content.slice
                 ? null
                 : `${this.name} (when supplied) must be embellished with slicedReducer(). SideBar: slicedReducer() should always wrap the the outer function passed to createFunction() (even when managedExpansion() is used).`
             )
           : `${this.name} (when supplied) must be a function`;
}

/**
 * Interpret the supplied features, generating our top-level app
 * reducer function.
 * 
 * @param {Feature[]} activeFeatures - The set of active (enabled)
 * features that comprise this application.
 *
 * @param {App} app the App object used in feature cross-communication.
 *
 * @private
 */
function assembleFeatureContent(activeFeatures, app) {

  // interpret the supplied features, generating our top-level app reducer function
  const appReducer = accumAppReducer(this.name, activeFeatures);
  // ?? handle NO reducers? a) NO: silently no-op redux (with warning), b) YES: throw error (saying if your using "reducer" aspect, you need to use it)

  // retain for subsequent usage
  this.appReducer = appReducer;
}


/**
 * Collect any redux middleware from other aspects through OUR
 * documented Aspect.getReduxMiddleware() API (an"aspect
 * cross-communication" mechanism).
 *
 * @param {Aspect[]} aspects - The set of **feature-u** Aspect objects
 * used in this this application.
 *
 * @param {App} app the App object used in feature cross-communication.
 *
 * @private
 */
function assembleAspectResources(aspects, app) {

  // collect any redux middleware from other aspects through OUR Aspect.getReduxMiddleware() API
  const middleware = aspects.reduce( (accum, aspect) => {
    if (aspect.getReduxMiddleware) {
      accum.push( aspect.getReduxMiddleware() );
    }
    return accum;
  }, []);

  // define our Redux app-wide store WITH optional middleware registration
  const appStore = middleware.length === 0
                    ? createStore(this.appReducer)
                    : createStore(this.appReducer,
                                  compose(applyMiddleware(...middleware)));

  // retain for subsequent usage
  this.appStore = appStore;
}


/**
 * Promote our redux store (for good measure), just in case some 
 * external process needs it.
 *
 * @private
 */
function getReduxStore() {
  return this.appStore;
}


/**
 * Introduce the standard Redux Provider component in the app root
 * element, providing standard access to the redux store (both state
 * and dispatch) through redux connect().
 * 
 * @param {reactElm} curRootAppElm - the current react app element root.
 *
 * @param {App} app the App object used in feature cross-communication.
 * 
 * @param {Feature[]} activeFeatures - The set of active (enabled)
 * features that comprise this application.  This can be used in an
 * optional Aspect/Feature cross-communication.  As an example, an Xyz
 * Aspect may define a Feature API by which a Feature can inject DOM
 * in conjunction with the Xyz Aspect DOM injection.
 *
 * @return {reactElm} a new react app element root (which in turn must
 * contain the supplied curRootAppElm), or simply the supplied
 * curRootAppElm (if no change).
 *
 * @private
 */
function injectRootAppElm(curRootAppElm, app, activeFeatures) {
  return (
    <Provider store={this.appStore}>
      {curRootAppElm}
    </Provider>
  );
  // TODO: if an external "feature" changes curRootAppElm to an array, <Provider> can't handle multiple children
}


/**
 * @private
 *
 * Interpret the supplied features, generating our top-level app
 * reducer function.
 *
 * @param {string} aspectName self's aspect name, used to "key"
 * aspects of this type in the Feature object: `Feature.{name}: xyz`.

 * @param {Feature[]} activeFeatures the "active" features that
 * comprise this application.
 *
 * @return {appReducerFn} a top-level app reducer function.
 */
export function accumAppReducer(aspectName, activeFeatures) { // ... named export ONLY used in testing

  // iterated over all activeFeatures,
  // ... generating the "shaped" genesis structure
  //     used in combining all reducers into a top-level app reducer
  //     EXAMPLE:
  //     - given following reducers (each from a seperate Feature):
  //         Feature.reducer: slicedReducer('device',           deviceReducerFn)
  //         Feature.reducer: slicedReducer('auth',             authReducerFn)
  //         Feature.reducer: slicedReducer('view.currentView', currentViewReducerFn)
  //         Feature.reducer: slicedReducer('view.discovery',   discoveryReducerFn)
  //         Feature.reducer: slicedReducer('view.eateries',    eateriesReducerFn)
  //     - the following shapedGenesis will result:
  //         shapedGenesis: {
  //           device:        deviceReducerFn,
  //           auth:          authReducerFn,
  //           view: {
  //             currentView: currentViewReducerFn,
  //             discovery:   discoveryReducerFn,
  //             eateries:    eateriesReducerFn,
  //           }
  //         }
  const shapedGenesis = {};
  for (const feature of activeFeatures) {

    // only interpret features that define our aspect
    if (feature[aspectName]) {

      const reducer = feature[aspectName]; // our feature content is a reducer!
      const slice   = reducer.slice;       // our validation ensures embelishment via slicedReducer()

      // interpret the slice's federated namespace into a structure with depth
      const nodeNames    = slice.split('.');
      let   runningNode  = shapedGenesis;
      let   runningShape = '';

      for (let i=0; i<nodeNames.length; i++) { // use old-styled for loop to interpret index (see: leafNode variable)
        const nodeName = nodeNames[i];
        const leafNode = (i === nodeNames.length-1);

        // utilize existing subNode (from other features), or create new (on first occurance)
        const subNodeExisted = (runningNode[nodeName]) ? true : false;
        const subNode        = runningNode[nodeName] || {};

        // maintain human readable shape (for error reporting)
        runningShape += (runningShape?'.':'') + nodeName;

        // apply validation constraints of our shapedGenesis
        // 1: intermediate node cannot be a reducer, because we can't intermix feature reducer with combineReducer (of launchApp)
        // 2: all leafs MUST be reducer functions (this is actually FORCED by our code below)
        if ( isFunction(subNode) || (subNodeExisted && leafNode) ) { // TO BE ORDER INDEPENDENT, added: or condition
          throw new Error(`*** ERROR*** feature-u launchApp() constraint violation: reducer slice: '${runningShape}' cannot be specified by multiple features (either as an intermediate node, or an outright duplicate) because we can't intermix feature reducers and combineReducer() from launchApp()`);
        }

        // inject our new sub-node -or- the reducer for leaf nodes
        runningNode[nodeName] = leafNode ? reducer : subNode;

        // continue process into next level
        runningNode = subNode;
      }
    }
  }

  // convert our "shaped" genesis structure into a single top-level app reducer function
  const appHasNoState = Object.keys(shapedGenesis).length === 0;
  const appReducer    = appHasNoState 
                          ? (s) => s // identity reducer (for no state) ?? is this an error?
                          : accumReducer(shapedGenesis);
  return appReducer;
}


/**
 * A recursive function that acumulates all reducers in the supplied
 * genisisNode into a single reducer function.
 *
 * @param {GenisisStruct} genesisNode a "shaped" genesis structure
 * used in combining all reducers.
 *
 * @return {reducerFn} a reducer function that recursivally
 * accumulates all reducers found in the supplied genesisNode.
 *
 * @private
 */
function accumReducer(genesisNode) {

  if (isFunction(genesisNode)) {
    return genesisNode;
  }

  const subReducers = {};
  for (const subGenesisNodeName in genesisNode) {
    const subGenesisNode = genesisNode[subGenesisNodeName];
    subReducers[subGenesisNodeName] = accumReducer(subGenesisNode);
  }

  return combineReducers( subReducers );
}
