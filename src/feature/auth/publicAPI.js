import actions  from './actions';

/**
 * The public API promoted by this feature through: app.auth...
 */
export default {
  actions: {
    bootstrap:          actions.bootstrap,          // bootstrap() our authorization process ?? for coupling we should do this differently
    userProfileChanged: actions.userProfileChanged, // userProfileChanged(userProfile) ... userProfile: {name, pool}
  },
};
