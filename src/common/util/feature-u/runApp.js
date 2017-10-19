// ?? check imports
import {combineReducers}  from 'redux';
import verify             from '../verify';
import isString           from 'lodash.isstring';
import isFunction         from 'lodash.isfunction';


/**
 * Launch an app by assembling/configuring the supplied app features.
 *
 * The runApp() function manages the configuration of all feature
 * aspects including: actions, logic, reducers, routing, etc.  In
 * addition it drives various app life-cycle methods (on the Feature
 * object), allowing selected features to inject initialization
 * constructs, etc.
 *
 * The runApp() function maintains an App object, which facilitates
 * cross-communication between features.  The App object is promoted
 * through redux-logic inject, and is also returned from this runApp()
 * invocation (which can be exported to facilitate other
 * communication).
 *
 * Example:
 * ```
 *   import {runApp} from 'feature-u';
 *   import features from '../features';
 *   export default runApp(features);
 * ```
 *
 * @param {Feature[]} features the features that comprise this
 * application.
 *
 * @return {App} an app object which used in feature
 * cross-communication (as follows):
 * ```
 *  {
 *    ?? document
 *  }
 * ```
 */
export default function runApp(features) {

  // ***
  // *** validate parameters
  // ***

  const check = verify.prefix('runApp() parameter violation: ');

  check(features, 'features is required');
  check(features.length && features.length>0, 'features should be an array of one or more Feature objects');


  // ***
  // *** define our app-wide reducer that specifies our overall appState
  // ***

  const appReducer = accumAppReducer(features);
  

  // ??? MORE


  // ***
  // *** return a new App object (used in feature cross-communication)
  // ***

  return {
    // ? .{feature}.selectors.abc()
    // ? .{feature}.actions.xyz()
  };

}

/**
 * Create our top-level redux appStore, WITH our registered redux-logic.
 *
 * @param {???} reducer the app-wide reducer function, defining our overall appState.
 * @param {???} logic the ???
 * @param {???} api the ???
 * @param {???} ??? the ???
 *
 * @return {Redux Store} the top-levl redux appStore.
 */
function createAppStore() {
  // ?? pattern after c:/TEMP/EateryByType/src/app/startup/createAppStore.js
}


/**
 * Interpret the supplied features, generating an top-level app
 * reducer function.
 *
 * @param {Feature[]} features the features that comprise this
 * application.
 *
 * @return {appReducerFn} a top-level app reducer function.
 *
 * @private
 */
export function accumAppReducer(features) { // ... named export ONLY used for testing

  // iterated over all features
  // ... generating the "shaped" genesis structure
  //     used in combining all reducers into a top-level app reducer
  const shapedGenesis = {};
  for (const feature of features) {

    // only interpret enabled features that define reducers
    if (feature.enabled && feature.reducer) {

      const reducer = feature.reducer;
      const shape   = feature.reducer.shape || feature.name; // default shape to feature name (when not supplied in a shapedReducer)

      // interpret the shape's federated namespace into a structure with depth
      const nodeNames    = shape.split('.');
      let   runningNode  = shapedGenesis;
      let   runningShape = '';

      for (let i=0; i<nodeNames.length; i++) { // need old-styled for loop to interpret index (see: leafNode variable)
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
          throw new Error(`*** ERROR*** feature-u runApp() constraint violation: reducer shape: '${runningShape}' cannot be specified by multiple features (either as an intermediate node, or an outright duplicate) because we can't intermix feature reducers and combineReducer() from runApp()`);
        }

        // inject our new sub-node -or- the reducer for leaf nodes
        runningNode[nodeName] = leafNode ? reducer : subNode;

        // continue process into next level
        runningNode = subNode;
      }
    }
  }

  // convert our "shaped" genesis structure into a single top-level app reducer function
  const  appHasNoSate = Object.keys(shapedGenesis).length === 0;
  const  appReducer   = appHasNoSate 
                          ? (s) => s // identity reducer (for no state)
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
export function accumReducer(genesisNode) { // ... named export ONLY used for testing

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
