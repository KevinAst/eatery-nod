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
      'actions.addEatery':     actions.dbPool.add,      // addEatery(eateryId)    ... slight naming variation to original action
      'actions.removeEatery':  actions.dbPool.remove,   // removeEatery(eateryId) ... slight naming variation to original action

      'sel.getEateryDbPool':   sel.getDbPool, // ... slight naming variation to original selector
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
    dispatch( fassets.actions.changeView(featureName) );
  },
});
