import 'babel-polyfill'; // required for feature-u es2015+ constructs
import './util/ErrorExtensionPolyfill';
import React                 from 'react';
import Expo                  from 'expo';
import {LayoutAnimation}     from 'react-native';
import {launchApp}           from 'feature-u';
import {createReducerAspect} from 'feature-redux';
import {createLogicAspect}   from 'feature-redux-logic';
import {createRouteAspect}   from 'feature-router';
import features              from './feature';
import SplashScreen          from './util/comp/SplashScreen';
import configureEateryNodDiagnostics  from './util/configureEateryNodDiagnostics';

// launch our application, exposing the feature-u Fassets object (facilitating cross-feature-communication)!
export default launchApp({
  aspects: appAspects(),
  features,
  registerRootAppElm(rootAppElm) {
    Expo.registerRootComponent(()=>rootAppElm); // convert rootAppElm to a React Component
  }
});


// accumulate/configure the Aspect plugins matching our app's run-time stack
function appAspects() {

  // define our framework run-time stack
  const reducerAspect = createReducerAspect();
  const logicAspect   = createLogicAspect();
  const routeAspect   = createRouteAspect();
  const aspects = [
    reducerAspect, // redux          ... extending: Feature.reducer
    logicAspect,   // redux-logic    ... extending: Feature.logic
    routeAspect,   // Feature Routes ... extending: Feature.route
  ];

  // configure Aspects (as needed)
  // ... StateRouter fallback screen (when no routes are in effect)
  routeAspect.config.fallbackElm$ = <SplashScreen msg="I'm trying to think but it hurts!"/>;
  // ... StateRouter animation hook
  routeAspect.config.componentWillUpdateHook$ = () => LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

  // configure our app's overall diagnostics (non-production code)
  configureEateryNodDiagnostics(reducerAspect, logicAspect, routeAspect);

  // beam me up Scotty :-)
  return aspects;
}
