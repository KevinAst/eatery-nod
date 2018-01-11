import React               from 'react';
import * as sel            from './state';
import {featureRoute, 
        PRIORITY}          from '../../util/feature-u/aspect/feature-u-state-router';
import featureName         from './featureName';
import EateriesListScreen  from './comp/EateriesListScreen';
import EateryDetailScreen  from './comp/EateryDetailScreen';
import EateryFilterScreen  from './comp/EateryFilterScreen';
import SplashScreen        from '../../util/comp/SplashScreen';

// ***
// *** The routes for this feature.
// ***

export default [

  featureRoute({
    priority: PRIORITY.HIGH,
    content({app, appState}) {
      // display EateryFilterScreen, when form is active (accomplished by our logic)
      // ... this is done as a priority route, because this screen can be used to
      //     actually change the view - so we display it regarless of the state of the active view
      if (sel.isFormFilterActive(appState)) {
        return <EateryFilterScreen/>;
      }
    }
  }),

  featureRoute({
    content({app, appState}) {

      // allow other down-stream features to route, when the active view is NOT ours
      if (app.currentView.sel.getView(appState) !== featureName) {
        return null;
      }
      
      // ***
      // *** at this point we know the active view is ours
      // ***
      
      // display anotated SplashScreen, when the spin operation is active
      const spinMsg = sel.getSpinMsg(appState);
      if (spinMsg) {
        return <SplashScreen msg={spinMsg}/>;
      }
      
      // display an eatery detail, when one is selected
      const selectedEatery = sel.getSelectedEatery(appState);
      if (selectedEatery) {
        return <EateryDetailScreen eatery={selectedEatery}/>;
      }
      
      // fallback: display our EateriesListScreen
      return <EateriesListScreen/>;
    }
  }),

];
