import React             from 'react';
import Expo              from 'expo';
import {LayoutAnimation} from 'react-native';
import {launchApp}       from 'feature-u';
import {reducerAspect}   from 'feature-redux';
import {logicAspect}     from 'feature-redux-logic';
import {routeAspect}     from 'feature-router';
import SplashScreen      from './util/comp/SplashScreen';
import features          from './feature'; // the set of features that comprise this application
import logActions        from './feature/logActions'; // enable/disable eatery-nod's action logger

// define our set of "plugable" feature-u Aspects, conforming to our app's run-time stack
const aspects = [
  reducerAspect, // redux          ... extending: Feature.reducer
  logicAspect,   // redux-logic    ... extending: Feature.logic
  routeAspect,   // Feature Routes ... extending: Feature.route
];

// configure Aspects (as needed)
// ... StateRouter fallback screen (when no routes are in effect)
routeAspect.fallbackElm = <SplashScreen msg="I'm trying to think but it hurts!"/>;
// ... StateRouter animation hook
routeAspect.componentWillUpdateHook = () => LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

// configure logging
launchApp.diag.logf.enable(); // feature-u/plugin diagnostic logging
// launchApp.diag.logf.elm2html = (elm) => elm; // show react elms as object blobs
logActions.enabled = false;   // eatery-nod's action logger

// launch our app, exposing the feature-u App object (facilitating cross-feature communication)!
export default launchApp({
  aspects,
  features,
  registerRootAppElm(rootAppElm) {
    Expo.registerRootComponent(()=>rootAppElm); // convert rootAppElm to a React Component
  }
});
