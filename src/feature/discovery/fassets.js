import * as api     from './api';
import actions      from './actions';
import featureName  from './featureName';

/**
 * The Public Face promoted by this feature.
 */
export default {
  define: {
    [`${featureName}.api`]: api,

    [`${featureName}.actions.openFilterDialog`]: actions.filterForm.open, // openFilterDialog([domain] [,formMsg])
  }
};
