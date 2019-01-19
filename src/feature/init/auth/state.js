import {combineReducers}    from 'redux';
import {reducerHash}        from 'astx-redux-util';
import {expandWithFassets}  from 'feature-u';
import {slicedReducer}      from 'feature-redux';
import featureName          from './featureName';
import signInFormMeta       from './signInFormMeta';
import actions              from './actions';
import User                 from '../../services/authService/User';

// ***
// *** Our feature reducer, managing state for our authorization process.
// ***

// NOTE: expandWithFassets() is NOT only used for fassets injection,
//       but ALSO to delay expansion (avoiding circular dependencies
//       in selector access from signInFormMeta.js)
const reducer = slicedReducer(featureName, expandWithFassets( (fassets) => combineReducers({

  // the current User object (serialized to state only) ... can represent empty User - NOT signed in
  user: reducerHash({
    [actions.signIn.complete]:           (state, action) => action.user.toStruct(),
    [actions.signIn.checkEmailVerified]: (state, action) => action.user.toStruct(), // containing updated User.emailVerified
    [actions.userProfileChanged]:        (state, action) => action.user.toStruct(), // pulling in new profile info
    [actions.signOut]:                   (state, action) => new User().toStruct(),  // an empty User - NOT signed in
  }, new User().toStruct()), // initialState (an empty User - NOT signed in)

  // SignIn iForm's reducer ... null indicates form is inactive
  signInForm: signInFormMeta.registrar.formReducer(),

}) ) );

export default reducer;


// ***
// *** Various Selectors
// ***

      // Our feature state root (via slicedReducer as a single-source-of-truth)
const getFeatureState  = (appState) => reducer.getSlicedState(appState);
const gfs              = getFeatureState;             // ... concise alias (used internally)


             // the current User object (with all it's value-added methods)
             //   LIKE: user.getAuthStatus()
             //         user.isUserSignedOut()
             //         user.isUserSignedIn()
             //         user.isUserSignedInUnverified()
             //         user.name
             //         user.email
             //         user.pool
             //   NOTE: will always return a User object (may represent a no-user object that: isSignedOut())
export const getUser = (appState) => new User(gfs(appState).user);

             // SignIn form  related
export const isSignInFormActive = (appState) => gfs(appState).signInForm ? true : false;
export const getUserSignInForm  = (appState) => gfs(appState).signInForm;
