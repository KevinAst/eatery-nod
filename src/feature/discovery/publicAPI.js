import * as api from './api';
import actions  from './actions';

/**
 * The public API promoted by this feature through: app.discovery...
 */
export default {
  api,
  actions: {
    openFilterDialog: actions.filter.open, // openFilterDialog([domain] [,formMsg])
  },
};
