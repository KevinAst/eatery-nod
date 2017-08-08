import {reducerHash}  from 'astx-redux-util';
import actions        from '../actions';

// user.pool: string (from firebase DB userProfile)
export default reducerHash({
  [actions.auth.signIn.complete]: (state, action) => action.userProfile.pool,
  [actions.auth.signOut]:         (state, action) => null,
}, null); // initialState
