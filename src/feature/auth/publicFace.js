import actions  from './actions';
import * as sel from './state';

/**
 * The publicFace promoted by this feature through: app.auth...
 */
export default {
  actions: {
    userProfileChanged: actions.userProfileChanged, // userProfileChanged(userProfile) ... userProfile: {name, pool}
    signOut:            actions.signOut,            // signOut()
  },
  sel: {
    getUserPool:        sel.getUserPool,
  },
};
