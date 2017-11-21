import React               from 'react';
//import * as sel            from './state'; // ?? L8TR
import {createRoute}       from '../../util/feature-u';
import featureName         from './featureName';
import EateriesListScreen  from './comp/EateriesListScreen';
import EateryDetailScreen  from './comp/EateryDetailScreen';
import EateryFilterScreen  from './comp/EateryFilterScreen';
import SplashScreen        from '../../util/comp/SplashScreen';

// ***
// *** The routes for this feature.
// ***

export default createRoute({

  // ?? mark items needing selector

  priorityContent(app, appState) {

    // display EateryFilterScreen, when form is active (accomplished by our logic)
    // ... this is done as a priority route, because this screen can be used to
    //     actually change the view - so we display it regarless of the state of the active view
    if (appState.eateries.listView.filterForm) { // ?? need selector
      return <EateryFilterScreen/>;
    }

  },

  content(app, appState) {

    // allow other down-stream features to route, when the active view is NOT ours
    // ?? TEMPORARLY NO-OP ... this is coming from 'activeView' feature's public API
    //? if (appState.view !== featureName) {
    //?   return null;
    //? }

    // ***
    // *** at this point we know the active view is ours
    // ***

    // display anotated SplashScreen, when the spin operation is active
    if (appState.eateries.spin) { // ?? need selector
      return <SplashScreen msg={appState.eateries.spin}/>;
    }

    // display our detailed view, when it is active
    if (appState.eateries.detailView) { // ?? need selector
      const eatery = appState.eateries.dbPool[appState.eateries.detailView];
      return <EateryDetailScreen eatery={eatery}/>;
    }

    // fallback: display our EateriesListScreen
    return <EateriesListScreen/>;
  },

});
