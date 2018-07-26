import * as api from './api';
import actions  from './actions';

/**
 * The Public Face promoted by this feature.
 */
export default {
  define: {
    'discovery.api': api,

    'discovery.actions.openFilterDialog': actions.filterForm.open, // openFilterDialog([domain] [,formMsg])
  }
};
