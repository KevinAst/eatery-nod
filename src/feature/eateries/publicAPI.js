import actions  from './actions';
import * as sel from './state';

/**
 * The public API promoted by this feature through: app.eateries...
 */
export default {
  actions: {
    openFilterDialog: actions.applyFilter.open, // openFilterDialog([domain] [,formMsg])
    add:              actions.dbPool.add,       // add(eateryId)
    remove:           actions.dbPool.remove,    // remove(eateryId)
  },
  sel: {
    getDbPool: sel.getDbPool,
  },
};
