import actions  from './actions';

/**
 * The public API promoted by this feature through: app.eateries...
 */
export default {
  actions: {
    openFilterDialog: actions.applyFilter.open, // openFilterDialog([domain] [,formMsg])
  },
};
