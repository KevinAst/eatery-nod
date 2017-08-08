import {reducerHash}  from 'astx-redux-util';
import actions        from '../actions';

// user.email: string (from signed-in firebase user)
export default reducerHash({
  [actions.auth.signIn.complete]: (state, action) => action.user.email,
  [actions.auth.signOut]:         (state, action) => null,
}, null); // initialState
