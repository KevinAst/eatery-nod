import actions  from './actions';
import * as sel from './state';

/**
 * The Public Face promoted by this feature.
 */
export default {
  define: {
    'auth.actions.userProfileChanged': actions.userProfileChanged, // userProfileChanged(userProfile) ... userProfile: {name, pool}
    'auth.actions.signOut':            actions.signOut,            // signOut()

    'auth.sel.getUserPool':            sel.getUserPool,
  },
};
