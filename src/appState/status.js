import {reducerHash}  from 'astx-redux-util';
import actions        from '../actions';

// user.status: string
//   'signedOut':          unauthorized
//   'signedInUnverified': signed in BUT email verification in-progress
//   'signedIn':           fully signed in (authorized/verified/profiled)
export default reducerHash({
  [actions.auth.signIn.complete]:           (state, action) => action.user.emailVerified ? 'signedIn' : 'signedInUnverified',
  [actions.auth.signIn.checkEmailVerified]: (state, action) => action.user.emailVerified ? 'signedIn' : 'signedInUnverified',
  [actions.auth.signOut]:                   (state, action) => 'signedOut',
}, 'signedOut'); // initialState
