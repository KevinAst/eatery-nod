import {combineReducers}  from 'redux';
import {reducerHash}      from 'astx-redux-util';
import {shapedReducer}    from '../../util/feature-u';
import featureName        from './featureName';
import signInFormMeta     from './signInFormMeta';
import actions            from './actions';

// ***
// *** Our feature reducer, managing state for our authoration process.
// ***

const reducer = shapedReducer(featureName, combineReducers({

  user: combineReducers({

    // user.status: string
    //   'signedOut':          unauthorized
    //   'signedInUnverified': signed in BUT email verification in-progress
    //   'signedIn':           fully signed in (authorized/verified/profiled)
    status: reducerHash({
      [actions.signIn.complete]:           (state, action) => action.user.emailVerified ? 'signedIn' : 'signedInUnverified',
      [actions.signIn.checkEmailVerified]: (state, action) => action.user.emailVerified ? 'signedIn' : 'signedInUnverified',
      [actions.signOut]:                   (state, action) => 'signedOut',
    }, 'signedOut'), // initialState

    // user.name: string (from firebase DB userProfile)
    name: reducerHash({
      [actions.userProfileChanged]:  (state, action) => action.userProfile.name,
      [actions.signOut]:          (state, action) => null,
    }, null), // initialState

    // user.email: string (from signed-in firebase user)
    email: reducerHash({
      [actions.signIn.complete]: (state, action) => action.user.email,
      [actions.signOut]:         (state, action) => null,
    }, null), // initialState

    // user.pool: string (from firebase DB userProfile)
    pool: reducerHash({
      [actions.userProfileChanged]: (state, action) => action.userProfile.pool,
      [actions.signOut]:            (state, action) => null,
    }, null), // initialState

  }),

  // inject the standard SignIn form-based reducer
  signInForm: signInFormMeta.registrar.formReducer(),
}) );

export default reducer;


// ***
// *** Various Selectors
// ***

// our standard selector accessing the root of our feature state
// ... uses single-source-of-truth from our shapedReducer
// ... WITH convenient gfs alias
const getFeatureState = gfs            = (appState) => reducer.getShapedState(appState);

export const getUserStatus             = (appState) => gfs(appState).user.status;
export const isUserUnverifiedSignedIn  = (appState) => getUserStatus(appState) === 'signedInUnverified';
export const isUserSignedIn            = (appState) => getUserStatus(appState) === 'signedIn';
export const isUserSignedOut           = (appState) => getUserStatus(appState) === 'signedOut';

export const isSignInFormActive        = (appState) => gfs(appState).signInForm ? true : false;

export const getUserName               = (appState) => gfs(appState).user.name;
export const getUserEmail              = (appState) => gfs(appState).user.email;
export const getUserPool               = (appState) => gfs(appState).user.pool;

export const getUserSignInForm         = (appState) => gfs(appState).user.signInForm;
