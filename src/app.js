import Expo            from 'expo';
import React           from 'react'; // ?? think this is needed
import {routeAspect}   from './util/feature-u/aspect/feature-u-state-router';
import {reducerAspect} from './util/feature-u/aspect/feature-u-redux';
import {logicAspect}   from './util/feature-u/aspect/feature-u-redux-logic';
import {launchApp}     from './util/feature-u';
import SplashScreen    from './util/comp/SplashScreen';
import features        from './feature';

// configure Aspects
routeAspect.fallbackElm = <SplashScreen msg="I'm trying to think but it hurts!"/>;
// ?? also add animation hooks

export default launchApp({

  aspects: [
    routeAspect,   // ?? must be first because <StateRouter> does NOT support children
    reducerAspect, // ??$$ WAS 2, try 1 (ERR from routeAspect), try 3 (SAME PROBLEM)
    logicAspect,
  ],

  features,

  registerRootAppElm(rootAppElm) {
    Expo.registerRootComponent(()=>rootAppElm); // convert rootAppElm to a React Component
  }
});
