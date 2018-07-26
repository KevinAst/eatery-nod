import actions      from './actions';
import * as sel     from './state';
import featureName  from './featureName';

/**
 * The Public Face promoted by this feature.
 */
export default {
  define: {
    [`${featureName}.actions.openFilterDialog`]: actions.filterForm.open, // openFilterDialog([domain] [,formMsg])
    [`${featureName}.actions.add`]:              actions.dbPool.add,      // add(eateryId)
    [`${featureName}.actions.remove`]:           actions.dbPool.remove,   // remove(eateryId)

    [`${featureName}.sel.getDbPool`]: sel.getDbPool,
  }
};
