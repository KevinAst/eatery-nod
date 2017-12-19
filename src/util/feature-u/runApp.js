import Expo                    from 'expo';
import React                   from 'react';
import {applyMiddleware,
        compose,
        createStore,
        combineReducers}       from 'redux';
import {createLogicMiddleware} from 'redux-logic';
import {Provider}              from 'react-redux';
import {expandFeatureAspect_publicFace,
        expandFeatureAspects}  from './createFeature';
import Router                  from './Router';
import isFunction              from 'lodash.isfunction';
import verify                  from '../verify';

/**
 * @function runApp
 * @description
 *
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
 * ```js
 *   import {runApp} from 'feature-u';
 *   import features from '../features';
 *
 *   export default runApp(features);
 * ```
 *
 * @param {Feature[]} features the features that comprise this
 * application.
 *
 * @return {App} an app object which used in feature
 * cross-communication (as follows):
 * ```js
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


  // prune to activeFeatures, insuring all feature.names are unique
  const allNames = {};
  const activeFeatures = features.filter( feature => {
    check(!allNames[feature.name], `feature.name: '${feature.name}' is NOT unique`);
    return feature.enabled;
  });


  // ***
  // *** create our new App object (used in cross-communication of features)
  // ***

  const app =  {
    // EX:
    // featureA: {
    //   selectors: {
    //     abc(appState),
    //   },
    //   actions: {
    //     xyz(...),
    //   }
    // },
    // featureB: {
    //   ...
    // },
    // etc: {
    //   ...
    // },
  };

  // expand/promote the publicFace aspect of ALL features FIRST (i.e. before other feature aspects)
  // so the expansion of other feature apects can use it
  // ... this eliminates order dependency issues related to feature
  //     expansion - EVEN in code that is expanded in-line.  The only
  //     exception to this is dependencies in the publicFace itself (which
  //     should be an anti-pattern)
  activeFeatures.forEach( feature => {
    // expand the publicFace of this feature
    expandFeatureAspect_publicFace(feature, app);

    // promote the feature publicFace in our app
    // ... defaulting to an empty object (indicating the feature is enabled)
    app[feature.name] = feature.publicFace || {};
  });

  // expand all other aspects of our features
  // ... now that they have access to the publicFace of ALL features (via app)
  activeFeatures.forEach( feature => {
    expandFeatureAspects(feature, app);
  });


  // ***
  // *** define our top-level redux appReducer that specifies our overall appState
  // ***

  // DONE: has migrated to: src/util/feature-u/aspect/feature-u-redux/reducerAspect.js
  const appReducer = accumAppReducer(activeFeatures);


  // ***
  // *** accumulate logic modules
  // ***

  let appLogic = [];
  activeFeatures.forEach( feature => {
    if (feature.logic) {
      appLogic = [...appLogic, ...feature.logic];
    }
  });
  

  // ***
  // *** define our top-level redux appStore, WITH our registered redux-logic
  // ***
  
  const appStore = createAppStore(appReducer, appLogic, app);


  // ***
  // *** define our router, which is the root of our App's component tree
  // ***

  // accumulate all the routes from our features
  // ... each feature has the oppertunity to contribute to our routes
  const routes = [];
  activeFeatures.forEach( feature => {
    if (feature.route) {
      // console.log(`xx runApp acumulating route for ${feature.name}`);
      routes.push(feature.route);
    }
  });
  // console.log(`xx runApp routes: `, routes);

  // define our <Router> component, which will be injected at the root
  // of our App's component tree
  // ... before that (however), our features have the 
  //     oppertunity to inject additional content at the root
  //     (see appWillStart() below)
  let children = <Router app={app} routes={routes}/>;


  // ***
  // *** apply appWillStart(app, children) life-cycle hooks
  // ***

  // appWillStart() can do any initialization
  // -AND- supplement our top-level content (using a non-null return)
  activeFeatures.forEach( feature => {
    if (feature.appWillStart) {
      children = feature.appWillStart(app, children) || children;
    }
  });


  // ***
  // *** define our appRootComp and register it to Expo
  // ***

  // TODO: if a "feature" changes children to an array, <Provider> can't handle multiple children
  // register our appRootComp to Expo, wiring up redux, and our left-nav sidebar
  const appRootComp = () => (
    <Provider store={appStore}>
      {children}
    </Provider>
  );
  Expo.registerRootComponent(appRootComp);


  // ***
  // *** apply appDidStart({app, appState, dispatch}) life-cycle hooks
  // ***

  activeFeatures.forEach( feature => {
    if (feature.appDidStart) {
      feature.appDidStart({
        app,
        appState: appStore.getState(),
        dispatch: appStore.dispatch,
      });
    }
  });


  // ***
  // *** expose our new App object (used in feature cross-communication)
  // ***

  return app;

}

/**
 * @private
 *
 * Create our top-level redux appStore, WITH our registered redux-logic.
 *
 * @param {reducerFn} appReducer the top-level redux appReducer that
 * specifies our overall appState
 *
 * @param {Logic[]} appLogic the accumulation of redux-logic modules
 * that comprise our app
 *
 * @param {App} app the feature-u app object used in feature
 * cross-communication (to be injected into the redux middleware)
 *
 * @return {ReduxStore} the top-levl redux appStore.
 */
function createAppStore(appReducer, appLogic, app) {

  // register our redux-logic modules, and inject app
  const logicMiddleware = createLogicMiddleware(appLogic,
                                                { // injected dependancies
                                                  app,
                                                });

  // define our Redux app-wide store, WITH our middleware registration
  const appStore = createStore(appReducer,
                               compose(applyMiddleware(logicMiddleware)));

  // ... AS NEEDED: provide additional redux-logic diagnostics
  //     logicMiddleware.monitor$.subscribe( probe => console.log('Diag(redux-logic diag): ', probe) );

  // promote our new appStore
  return appStore;
}


/**
 * @private
 *
 * Interpret the supplied features, generating an top-level app
 * reducer function.
 *
 * @param {Feature[]} features the "active" features that comprise this
 * application.
 *
 * @return {appReducerFn} a top-level app reducer function.
 *
 * @private
 */
// DONE: has migrated to: src/util/feature-u/aspect/feature-u-redux/reducerAspect.js
export function accumAppReducer(features) { // ... named export ONLY used for testing

  // iterated over all features
  // ... generating the "sliced" genesis structure
  //     used in combining all reducers into a top-level app reducer
  const slicedGenesis = {};
  for (const feature of features) {

    // only interpret active features that define reducers
    // ... technically we do NOT need to check enabled (because of our "controlled" runApp() invocation)
    //     HOWEVER, some of our tests do not pass through runApp()
    if (feature.enabled && feature.reducer) {

      const reducer = feature.reducer;
      const slice   = feature.reducer.slice; // createFeature() always embelishes reducer via slicedReducer()

      // interpret the slice's federated namespace into a structure with depth
      const nodeNames    = slice.split('.');
      let   runningNode  = slicedGenesis;
      let   runningSlice = '';

      for (let i=0; i<nodeNames.length; i++) { // need old-styled for loop to interpret index (see: leafNode variable)
        const nodeName = nodeNames[i];
        const leafNode = (i === nodeNames.length-1);

        // utilize existing subNode (from other features), or create new (on first occurance)
        const subNodeExisted = (runningNode[nodeName]) ? true : false;
        const subNode        = runningNode[nodeName] || {};

        // maintain human readable slice (for error reporting)
        runningSlice += (runningSlice?'.':'') + nodeName;

        // apply validation constraints of our slicedGenesis
        // 1: intermediate node cannot be a reducer, because we can't intermix feature reducer with combineReducer (of runApp)
        // 2: all leafs MUST be reducer functions (this is actually FORCED by our code below)
        if ( isFunction(subNode) || (subNodeExisted && leafNode) ) { // TO BE ORDER INDEPENDENT, added: or condition
          throw new Error(`*** ERROR*** feature-u runApp() constraint violation: reducer slice: '${runningSlice}' cannot be specified by multiple features (either as an intermediate node, or an outright duplicate) because we can't intermix feature reducers and combineReducer() from runApp()`);
        }

        // inject our new sub-node -or- the reducer for leaf nodes
        runningNode[nodeName] = leafNode ? reducer : subNode;

        // continue process into next level
        runningNode = subNode;
      }
    }
  }

  // convert our "sliced" genesis structure into a single top-level app reducer function
  const  appHasNoSate = Object.keys(slicedGenesis).length === 0;
  const  appReducer   = appHasNoSate 
                          ? (s) => s // identity reducer (for no state)
                          : accumReducer(slicedGenesis);
  console.log(`?? to document this, here is the slicedGenesis: `, slicedGenesis);
  return appReducer;
}


/**
 * @private
 *
 * A recursive function that acumulates all reducers in the supplied
 * genisisNode into a single reducer function.
 *
 * @param {GenisisStruct} genesisNode a "sliced" genesis structure
 * used in combining all reducers.
 *
 * @return {reducerFn} a reducer function that recursivally
 * accumulates all reducers found in the supplied genesisNode.
 *
 * @private
 */
// DONE: has migrated to: src/util/feature-u/aspect/feature-u-redux/reducerAspect.js
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
