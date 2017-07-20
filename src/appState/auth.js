import {combineReducers}  from 'redux';
import deviceCredentials  from './deviceCredentials';
import signInFormMeta     from '../logic/iForms/signInFormMeta';

export default combineReducers({
  deviceCredentials,
  signInForm: signInFormMeta.registrar.formReducer(), // inject the standard SignIn form-based reducer
});
