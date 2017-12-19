import {applyMiddleware,
        compose,
        createStore,
        combineReducers}  from 'redux';              // ?? EVENTUALLY peerDependency
import {Provider}         from 'react-redux';        // ?? EVENTUALLY peerDependency
import createAspect       from '../../createAspect'; // ?? EVENTUALLY peerDependency: import {createAspect} from 'feature-u';
import isFunction         from 'lodash.isfunction';

/**
 * ?? document ... somewhat dup of readme
 */
export default createAspect({
  name: 'reducer', // to fully manage all of redux, we ONLY need the reducers (hence our name)!
  validateFeatureContent,
  assembleFeatureContent,
  assembleAspectResources,
  getReduxStore,
  injectRootAppElm,
});


/**
 * Validate self's aspect content on supplied feature.
 *
 * NOTE: To better understand the context in which any returned
 *       validation messages are used, feature-u will prefix them
 *       with: 'createFeature() parameter violation: '
 *
 * @param {Feature} feature - the feature to validate, which is known
 * to contain this aspect.
 *
 * @return {string} an error message when the supplied feature
 * contains invalid content for this aspect (null when valid).
 */
function validateFeatureContent(feature) {
  const content = feature[this.name];
  return isFunction(content) || content.managedExpansion
           ? ( content.slice
                 ? null
                 : `${this.name} (when supplied) must be embellished with slicedReducer(). SideBar: slicedReducer() should always wrap the the outer function passed to createFunction() (even when managedExpansion() is used).`
             )
           : `${this.name} (when supplied) must be a function -or- a contextCB`;
}

/**
 * Interpret the supplied features, generating our top-level app
 * reducer function.
 * 
 * @param {Feature[]} activeFeatures - The set of active (enabled)
 * features that comprise this application.
 *
 * @param {App} app the App object used in feature cross-communication.
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
 * @param {Aspect[]} aspects - The set of feature-u Aspect objects
 * used in this this application.
 *
 * @param {App} app the App object used in feature cross-communication.
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
 * @return {reactElm} a new react app element root (which in turn must
 * contain the supplied curRootAppElm), or simply the supplied
 * curRootAppElm (if no change).
 */
function injectRootAppElm(curRootAppElm, app) {
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
 *
 * @private
 */
// ?? migrate tests
export function accumAppReducer(aspectName, activeFeatures) { // ... named export ONLY used in testing

  // iterated over all activeFeatures
  // ... generating the "shaped" genesis structure
  //     used in combining all reducers into a top-level app reducer
  // ... EXAMPLE:
  //     - given following reducers (each from a seperate Feature):
  //         Feature.reducer: slicedReducer('auth', reducerFn)
  //         Feature.reducer: slicedReducer('device', reducerFn)
  //         Feature.reducer: slicedReducer('xxx', reducerFn)
  //         Feature.reducer: slicedReducer('view.discovery', reducerFn)
  //         Feature.reducer: slicedReducer('view.eateries', reducerFn)
  //     - the following shapedGenesis will result
  //         shapedGenesis: {
  //           "auth":          [Function combination],
  //           "currentView": {
  //             "currentView": [Function anonymous],
  //           },
  //           "device":        [Function combination],
  //           "view": {
  //             "discovery":   [Function combination],
  //             "eateries":    [Function combination],
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
        // 1: intermediate node cannot be a reducer, because we can't intermix feature reducer with combineReducer (of runApp)
        // 2: all leafs MUST be reducer functions (this is actually FORCED by our code below)
        if ( isFunction(subNode) || (subNodeExisted && leafNode) ) { // TO BE ORDER INDEPENDENT, added: or condition
          throw new Error(`*** ERROR*** feature-u runApp() constraint violation: reducer slice: '${runningShape}' cannot be specified by multiple features (either as an intermediate node, or an outright duplicate) because we can't intermix feature reducers and combineReducer() from runApp()`);
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
 * @private
 *
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
accumReducer(genesisNode) {

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
