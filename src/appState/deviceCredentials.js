import {reducerHash}  from 'astx-redux-util';
import actions        from '../actions';

export default reducerHash({
  [actions.auth.bootstrap.haveDeviceCredentials]: (state, action) => action.encodedCredentials,
  [actions.auth.bootstrap.noDeviceCredentials]:   (state, action) => 'NONE',
}, null); // initialState
