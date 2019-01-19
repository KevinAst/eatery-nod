import actions      from './actions';
import * as sel     from './state';
import featureName  from './featureName';

/**
 * The Public Face promoted by this feature.
 */
export default {
  define: {
                                                   // actions:
    [`${featureName}.actions.userProfileChanged`]: actions.userProfileChanged, // userProfileChanged(user) NOTE: PUBLIC for eateries to monitor, and for future use (when user can change their pool)
    [`${featureName}.actions.signOut`]:            actions.signOut,            // signOut()

                                                   // selectors:
    [`${featureName}.sel.getUserPool`]:            (appState) => sel.getUser(appState).pool,
  },
};
