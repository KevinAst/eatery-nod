import actions  from './actions';
import * as sel from './state';

/**
 * The public API promoted by this feature through: app.auth...
 */
export default {
  actions: {
    bootstrap:          actions.bootstrap,          // bootstrap() our authorization process ?? for coupling we should do this differently ?? suspect NOT needed if we can bootstrap from life cycle
    userProfileChanged: actions.userProfileChanged, // userProfileChanged(userProfile) ... userProfile: {name, pool} ?? suspect NOT needed with advent of re-select
    signOut:            actions.signOut,            // signOut()
  },
  sel: {
    getUserPool:        sel.getUserPool,
  },
};
