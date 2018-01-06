import * as api from './api';
import actions  from './actions';

/**
 * The publicFace promoted by this feature through: app.discovery...
 */
export default {
  api,
  actions: {
    openFilterDialog: actions.filterForm.open, // openFilterDialog([domain] [,formMsg])
  },
};
