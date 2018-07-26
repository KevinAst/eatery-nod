import actions  from './actions';
import * as sel from './state';

/**
 * The Public Face promoted by this feature.
 */
export default {
  define: {
    'eateries.actions.openFilterDialog': actions.filterForm.open, // openFilterDialog([domain] [,formMsg])
    'eateries.actions.add':              actions.dbPool.add,      // add(eateryId)
    'eateries.actions.remove':           actions.dbPool.remove,   // remove(eateryId)

    'eateries.sel.getDbPool': sel.getDbPool,
  }
};
