import React                  from 'react';
import * as sel               from './state';
import {createRoute}          from '../../util/feature-u';
import featureName            from './featureName';
import DiscoveryFilterScreen  from './comp/DiscoveryFilterScreen';
import DiscoveryListScreen    from './comp/DiscoveryListScreen';


// ***
// *** The routes for this feature.
// ***

export default createRoute({

  priorityContent(app, appState) {

    // display DiscoveryFilterScreen, when form is active (accomplished by our logic)
    // ... this is done as a priority route, because this screen can be used to
    //     actually change the view - so we display it regarless of the state of the active view
    if (sel.isFormFilterActive(appState)) {
      return <DiscoveryFilterScreen/>;
    }
  },

  content(app, appState) {

    // allow other down-stream features to route, when the active view is NOT ours
    if (app.currentView.sel.getView(appState) !== featureName) {
      return null;
    }

    // ***
    // *** at this point we know the active view is ours
    // ***

    // display our DiscoveryListScreen
    return <DiscoveryListScreen/>;
  },

});
