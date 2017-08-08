import {combineReducers}  from 'redux';
import deviceCredentials  from './deviceCredentials';
import user               from './user';
import signInFormMeta     from '../logic/iForms/signInFormMeta';

export default combineReducers({
  deviceCredentials,
  user,
  signInForm: signInFormMeta.registrar.formReducer(), // inject the standard SignIn form-based reducer
});
