import actions      from './actions';
import * as sel     from './state';
import featureName  from './featureName';

/**
 * The Public Face promoted by this feature.
 */
export default {
  define: {
    [`${featureName}.actions.userProfileChanged`]: actions.userProfileChanged, // userProfileChanged(userProfile) ... userProfile: {name, pool}
    [`${featureName}.actions.signOut`]:            actions.signOut,            // signOut()

    [`${featureName}.sel.getUserPool`]:            sel.getUserPool,
  },
};
