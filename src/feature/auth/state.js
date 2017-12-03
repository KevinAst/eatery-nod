import {combineReducers}  from 'redux';
import {reducerHash}      from 'astx-redux-util';
import {shapedReducer,
        managedExpansion} from '../../util/feature-u';
import featureName        from './featureName';
import signInFormMeta     from './signInFormMeta';
import actions            from './actions';

// ***
// *** Our feature reducer, managing state for our authoration process.
// ***

// NOTE: managedExpansion() is used NOT for app injection,
//       but RATHER to delay expansion (avoiding circular dependancies
//       in selector access from signInFormMeta.js)
const reducer = shapedReducer(featureName, managedExpansion( () => combineReducers({

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

    // user.name: string (what UI calls this user you - from firebase DB userProfile ... null profile read)
    name: reducerHash({
      [actions.userProfileChanged]:  (state, action) => action.userProfile.name,
      [actions.signOut]:             (state, action) => null,
    }, null), // initialState

    // user.email: string (user's email sign-in credentials - from firebase user)
    email: reducerHash({
      [actions.signIn.complete]: (state, action) => action.user.email,
      [actions.signOut]:         (state, action) => null,
    }, null), // initialState

    // user.pool: string (eatery pool identifier - from firebase DB userProfile ... null profile read)
    pool: reducerHash({
      [actions.userProfileChanged]: (state, action) => action.userProfile.pool,
      [actions.signOut]:            (state, action) => null,
    }, null), // initialState

  }),

  // SignIn iForm's reducer ... null indicates form is inactive
  signInForm: signInFormMeta.registrar.formReducer(),

}) ) );

export default reducer;


// ***
// *** Various Selectors
// ***

                                         /** Our feature state root (via shapedReducer as a single-source-of-truth) */
const getFeatureState                  = (appState) => reducer.getShapedState(appState);
const gfs = getFeatureState;             // ... concise alias (used internally)

export const getUserStatus             = (appState) => gfs(appState).user.status;
export const isUserUnverifiedSignedIn  = (appState) => getUserStatus(appState) === 'signedInUnverified';
export const isUserSignedIn            = (appState) => getUserStatus(appState) === 'signedIn';
export const isUserSignedOut           = (appState) => getUserStatus(appState) === 'signedOut';

export const isSignInFormActive        = (appState) => gfs(appState).signInForm ? true : false;

export const getUserName               = (appState) => gfs(appState).user.name;
export const getUserEmail              = (appState) => gfs(appState).user.email;
export const getUserPool               = (appState) => gfs(appState).user.pool;

export const getUserSignInForm         = (appState) => gfs(appState).signInForm;
