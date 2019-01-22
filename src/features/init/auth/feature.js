import {createFeature}  from 'feature-u';
import featureName      from './featureName';
import actions          from './actions'; // TODO: QUERKYNESS of IFormMeta (aggravated by feature-u) ... actions MUST be expanded BEFORE IFormMeta instance (signInFormMeta)
import reducer          from './state';
import * as sel         from './state';
import logic            from './logic';
import route            from './route';

// feature: auth
//          promote complete user authentication service (full details in README)
export default createFeature({
  name: featureName,

  // our public face ...
  fassets: {
    define: {
      // actions:
      [`${featureName}.actions.userProfileChanged`]: actions.userProfileChanged, // userProfileChanged(user) NOTE: PUBLIC for eateries to monitor, and for future use (when user can change their pool)
      [`${featureName}.actions.signOut`]:            actions.signOut,            // signOut()

      // selectors:
      [`${featureName}.sel.getUserPool`]:            (appState) => sel.getUser(appState).pool,
    },
  },

  reducer,
  logic,
  route,
});
