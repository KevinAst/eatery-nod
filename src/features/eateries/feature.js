import {createFeature}    from 'feature-u';
import _eateries          from './featureName';
import _eateriesAct       from './actions'; // TODO: QUIRKINESS of IFormMeta (aggravated by feature-u) ... actions MUST be expanded BEFORE IFormMeta instance (eateryFilterFormMeta)
import reducer            from './state';
import * as _eateriesSel  from './state';
import logic              from './logic';
import route              from './route';
import EateryLeftNavItem  from './comp/EateryLeftNavItem';

// feature: eateries
//          manage and promotes the eateries view (a list of pooled
//          and filtered) restaurants, with the ability to select an
//          eatery through a random spin.  Selected eateries provides
//          the ability to phone, visit their web site, and navigate
//          to them (full details in README)
export default createFeature({
  name: _eateries,

  // our public face ...
  fassets: {
    define: {
      'actions.addEatery':     _eateriesAct.dbPool.add,      // addEatery(eateryId)    ... slight naming variation to original action
      'actions.removeEatery':  _eateriesAct.dbPool.remove,   // removeEatery(eateryId) ... slight naming variation to original action

      'sel.getEateryDbPool':   _eateriesSel.getDbPool, // ... slight naming variation to original selector
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
    dispatch( fassets.actions.changeView(_eateries) );
  },
});
