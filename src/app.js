import Expo            from 'expo';
import React           from 'react'; // required for JSX rendering
import {routeAspect}   from './util/feature-u/aspect/feature-u-state-router';
import {reducerAspect} from './util/feature-u/aspect/feature-u-redux';
import {logicAspect}   from './util/feature-u/aspect/feature-u-redux-logic';
import {launchApp}     from './util/feature-u';
import SplashScreen    from './util/comp/SplashScreen';
import features        from './feature';

// define our set of "plugable" feature-u Aspects, conforming to our app's run-time stack
const aspects = [
  routeAspect,   // StateRouter ... order: early, because <StateRouter> DOM injection does NOT support children
  reducerAspect, // redux       ... order: later, because <Provider> DOM injection should cover all prior injections
  logicAspect,   // redux-logic ... order: N/A,   because NO DOM injection
];

// configure our Aspects (as needed)
routeAspect.fallbackElm = <SplashScreen msg="I'm trying to think but it hurts!"/>;
// ?? also add animation hooks

// launch our app, exposing the feature-u App object (facilitating cross-feature communication)!
export default launchApp({
  aspects,
  features,
  registerRootAppElm(rootAppElm) {
    Expo.registerRootComponent(()=>rootAppElm); // convert rootAppElm to a React Component
  }
});
