import React               from 'react';
import * as sel            from './state';
import {createRoute}       from '../../util/feature-u';
import featureName         from './featureName';
import SignInVerifyScreen  from './comp/SignInVerifyScreen';
import SignInScreen        from './comp/SignInScreen';
import SplashScreen        from '../../util/comp/SplashScreen';

// ***
// *** The routes for this feature.
// ***

export default createRoute({

  priorityContent(app, appState) {

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
    //  1) we MUST issue a route to prevent downstream features from activating too early
    //  2) this can occur during transition (between startup/auth features)
    //     ... where logic is in the process of activating one of the auth form screens
    //     ... and therefore we cannot consider this an error (in our wording)
    //     ... however, we provide enough context in msg to highlight what is occuring
    //         (in case of logic error)
    const msg = `${featureName} route transition (${sel.getUserStatus(appState)})`
    return <SplashScreen msg={msg}/>;
  },

});