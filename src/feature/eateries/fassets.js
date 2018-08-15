import actions            from './actions';
import * as sel           from './state';
import featureName        from './featureName';
import EateryLeftNavItem  from './comp/EateryLeftNavItem';

/**
 * The Public Face promoted by this feature.
 */
export default {

  define: {
    [`${featureName}.actions.add`]:     actions.dbPool.add,      // add(eateryId)
    [`${featureName}.actions.remove`]:  actions.dbPool.remove,   // remove(eateryId)

    [`${featureName}.sel.getDbPool`]:   sel.getDbPool,
  },

  defineUse: {
    'leftNavItem.EateryItem': EateryLeftNavItem, // inject our entry into the leftNav
  }
};
