import React               from 'react';
import * as sel            from './state';
import {prioritizedRoute, 
        PRIORITY}          from '../../util/feature-u/aspect/feature-u-state-router';
import featureName         from './featureName';
import SignInVerifyScreen  from './comp/SignInVerifyScreen';
import SignInScreen        from './comp/SignInScreen';
import SplashScreen        from '../../util/comp/SplashScreen';

// ***
// *** The routes for this feature.
// ***

export default prioritizedRoute({

  priority: PRIORITY.HIGH,

  content({app, appState}) {

    // when user is FULLY signedIn/verified
    // ... allow down-stream features to route further (i.e. app-specific screens)
    if (sel.isUserSignedIn(appState)) {
      return null;
    }

    // when user is signed in BUT unverified
    // ... display email verification screen
    if (sel.isUserUnverifiedSignedIn(appState)) {
      return <SignInVerifyScreen/>;
    }

    // ***
    // *** at this point we know user is unauthorized (either signed out, or in-transision)
    // ***

    // display interactive SignIn, when form is active (accomplished by our logic)
    if (sel.isSignInFormActive(appState)) {
      return <SignInScreen/>;
    }

    // display interactive SignUp, when form is active (acomplished by our logic)
    // TODO: check for signUpForm (WHEN SUPPORTED)
    
    // fallback: communicate route transition condition
    // NOTES:
    //  1) we MUST issue a route to prevent downstream feature visualization too early
    //  2) it can occur under the following conditions:
    //     a) a slow server-side sign-in process
    //        ... and so the message wording should NOT convey an error
    //     b) during transition between startup/auth features
    //        ... where logic is in the process of activating one of the auth form screens
    //        ... and so the message wording should NOT convey an error
    //     c) an error condition (say some change that impacts our route logic)
    //        ... this is an unexpected condition
    //        ... SO, we expose the user-status context in the message (for diagnostics)
    const msg = `authorization in progress (${sel.getUserStatus(appState)})`;
    return <SplashScreen msg={msg}/>;
  },

});
