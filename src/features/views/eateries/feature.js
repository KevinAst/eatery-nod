import {createFeature}  from 'feature-u';
import featureName      from './featureName';
import actions          from './actions'; // TODO: QUIRKINESS of IFormMeta (aggravated by feature-u) ... actions MUST be expanded BEFORE IFormMeta instance (eateryFilterFormMeta)
import reducer          from './state';
import * as sel         from './state';
import logic            from './logic';
import route            from './route';
import EateryLeftNavItem  from './comp/EateryLeftNavItem';

// feature: eateries
//          manage and promotes the eateries view (a list of pooled
//          and filtered) restaurants, with the ability to select an
//          eatery through a random spin.  Selected eateries provides
//          the ability to phone, visit their web site, and navigate
//          to them (full details in README)
export default createFeature({
  name: featureName,

  // our public face ...
  fassets: {
    define: {
      [`${featureName}.actions.add`]:     actions.dbPool.add,      // add(eateryId)
      [`${featureName}.actions.remove`]:  actions.dbPool.remove,   // remove(eateryId)

      [`${featureName}.sel.getDbPool`]:   sel.getDbPool,
    },

    defineUse: {
      'leftNavItem.EateryItem': EateryLeftNavItem, // inject our entry into the leftNav
    }
  },

  reducer,
  logic,
  route,

  // default the app view to be self
  appDidStart({fassets, appState, dispatch}) {
    dispatch( fassets.currentView.actions.changeView(featureName) );
  },
});
