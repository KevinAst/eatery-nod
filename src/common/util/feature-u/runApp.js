import Expo                    from 'expo';
import React                   from 'react';
import {applyMiddleware,
        compose,
        createStore,
        combineReducers}       from 'redux';
import {createLogicMiddleware} from 'redux-logic';
import {Provider}              from 'react-redux';
import Router                  from './Router';
import {Drawer}                from 'native-base';
import SideBar, 
      {registerDrawer,
       closeSideBar}           from '../../../app/SideBar';
import isFunction              from 'lodash.isfunction';
import verify                  from '../verify';
import Notify                  from '../notify'; 

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
 * @param {API} api an app-specific API object (to be injected into
 * the redux middleware).
 *
 * @return {App} an app object which used in feature
 * cross-communication (as follows):
 * ```
 *  {
 *    ?? document
 *  }
 * ```
 */
export default function runApp(features, api) {

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
  // *** create our new App object (used in feature cross-communication)
  // ***

  const app =  {
    // EX:
    // {feature}: {
    //   .selectors: {
    //     .abc(appState) {...}
    //   },
    //   .actions: {
    //     .xyz(...) {...}
    //   }
    // }
  };

  // inject all active feature selectors/actions to app
  activeFeatures.forEach( feature => {
    const featureNode = app[feature.name] = {};
    if (feature.selectors) {
      featureNode.selectors = feature.selectors
    }
    // ?? same for actions
  });


  // ***
  // *** define our top-level redux appReducer that specifies our overall appState
  // ***

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
  
  const appStore = createAppStore(appReducer, appLogic, app, api);


  // ***
  // *** accumulate routers
  // ***

  const routers = [];
  activeFeatures.forEach( feature => {
    if (feature.router) {
      // console.log(`??? runApp acumulating router for ${feature.name}`);
      routers.push(feature.router);
    }
  });
  // console.log(`??? runApp routers: `, routers);


  // ***
  // *** apply appWillStart(app) life-cycle hooks
  // ***

  activeFeatures.forEach( feature => {
    if (feature.appWillStart) {
      feature.appWillStart(app);
    }
  });


  // ***
  // *** define our appRootComp and register it to Expo
  // ***

  // register our appRootComp to Expo, wiring up redux, and our left-nav sidebar

  // TODO: SideBar (an app-specific component) is currently directly used in this generic utility.
  //       This is a temporary measure to get us going.
  //       See SideBar.js code for some long-term solutions.
  // ********************************************************************************
  // ??$$ see if Drawer has to have children ... View is temporary ... looking for Wrapper article
  //? const Wrapper = ({children}) => children; // ?? can't get to work
  //? const content = [
  //?   <Drawer key="111"
  //?           ref={ ref => registerDrawer(ref) }
  //?           content={<SideBar/>}
  //?           onClose={closeSideBar}/>,
  //?   <Router  key="222" app={app} routers={routers}/>,
  //?   <Notify key="333"/>,
  //? ];
  //? const appRootComp = () => (
  //?   <Provider store={appStore}>
  //?     <Wrapper>
  //?       {content}
  //?     </Wrapper>
  //?   </Provider>
  //? );
  // ********************************************************************************
  // ??$$ ORIGINAL - WORKS
  //? const appRootComp = () => (
  //?   <Provider store={appStore}>
  //?     <Drawer ref={ ref => registerDrawer(ref) }
  //?             content={<SideBar/>}
  //?             onClose={closeSideBar}>
  //?       <Router app={app} routers={routers}/>
  //?       <Notify/>
  //?     </Drawer>
  //?   </Provider>
  //? );
  //? Expo.registerRootComponent(appRootComp);
  // ********************************************************************************

  // ??$$ TRY manipulating as children

  //? this works for multiple components
  //? let children = [
  //?   <Router app={app} routers={routers}/>,
  //?   <Notify/>
  //? ];

  // this works for single component
  let children = <Router app={app} routers={routers}/>; // our router is the crucial component!

  // simulate external feature injecting Notify as a sibling of our Router
  const childrenArr = React.Children.toArray(children);
  childrenArr.push(<Notify/>);
  children = childrenArr;

  // simulate external feature injecting Drawer at the top, with children <<< WORKS!!!
  // ... in general this top works, and CAN add to childen, by placing <Notify/> right after {children}
  children = (
    <Drawer ref={ ref => registerDrawer(ref) }
            content={<SideBar/>}
            onClose={closeSideBar}>
      {children}
      {/* see note above ... <Notify/> */}
    </Drawer>
  );
  // now complete the deal
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
 * @param {API} api an app-specific API object (to be injected into
 * the redux middleware)
 *
 * @return {Redux Store} the top-levl redux appStore.
 */
function createAppStore(appReducer, appLogic, app, api) {

  // register our redux-logic modules, and inject app/api
  const logicMiddleware = createLogicMiddleware(appLogic,
                                                { // injected dependancies
                                                  app,
                                                  api,
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
export function accumAppReducer(features) { // ... named export ONLY used for testing

  // iterated over all features
  // ... generating the "shaped" genesis structure
  //     used in combining all reducers into a top-level app reducer
  const shapedGenesis = {};
  for (const feature of features) {

    // only interpret active features that define reducers
    // ... technically we do NOT need to check enabled (because of our "controlled" runApp() invocation)
    //     HOWEVER, some of our tests do not pass through runApp()
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
