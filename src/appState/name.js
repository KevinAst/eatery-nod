import {reducerHash}  from 'astx-redux-util';
import actions        from '../actions';

// user.name: string (from firebase DB userProfile)
export default reducerHash({
  [actions.profile.changed]:  (state, action) => action.userProfile.name,
  [actions.auth.signOut]:     (state, action) => null,
}, null); // initialState