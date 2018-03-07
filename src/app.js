import React             from 'react';
import Expo              from 'expo';
import {LayoutAnimation} from 'react-native';
import {launchApp}       from 'feature-u';
import {reducerAspect}   from 'feature-redux';
import {logicAspect}     from 'feature-redux-logic';
import {routeAspect}     from 'feature-router';
import SplashScreen      from './util/comp/SplashScreen';
import features          from './feature'; // the set of features that comprise this application

configureDiagnostics();

// launch our app, exposing the feature-u App object (facilitating cross-feature communication)!
export default launchApp({
  aspects: appAspects(),
  features,
  registerRootAppElm(rootAppElm) {
    Expo.registerRootComponent(()=>rootAppElm); // convert rootAppElm to a React Component
  }
});


// accumulate/configure our Aspect plugins
// ... matching our app's run-time stack
function appAspects() {

  // here is our run-time stack
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

  // beam me up Scotty :-)
  return aspects;
}


//******************************************************************************
//*** NON Production Diagnostic Code follows ***********************************
//******************************************************************************

import {diag$}     from './util/diagnosticUtil';
import logActions  from './feature/logActions'; // enable eatery-nod "logActions" feature
import sandbox     from './feature/sandbox';    // enable eatery-nod "sandbox" feature (in left-nav)
import feature_u_integrationTests  from './util/feature-u.integrationTests';

// configure our diagnostics (if any)
function configureDiagnostics() {

  // --- eatery-nod logging/sandbox ... ------------------------------------------
  diag$.skip('enable eatery-nod "logActions" feature', () => {
    logActions.enabled = true;
  });
  diag$.skip('enable eatery-nod "sandbox" feature (in left-nav)', () => {
    sandbox.enabled = true;
  });

  // --- feature-u logging related ... -------------------------------------------
  diag$.skip('enable feature-u logging', () => {
    launchApp.diag.logf.enable();
  });
  diag$.skip('show feature-u react elms as object blobs', () => {
    launchApp.diag.logf.elm2html = (elm) => elm;
  });
  diag$.skip('show feature-u react elms as html markup', () => {
    // NOTE: requires ... import ReactDOMServer from 'react-dom/server';
    //       UNTESTED: react-native / expo has issues resolving this in node
    launchApp.diag.logf.elm2html = (elm) => ReactDOMServer.renderToStaticMarkup(elm);
  });

  // --- feature-u integration tests ... -----------------------------------------
  diag$.skip('perform feature-u integration tests', () => {
    feature_u_integrationTests();
  });
}
