import {combineReducers}  from 'redux';
import user               from './user';
import signInFormMeta     from '../logic/iForms/signInFormMeta';

export default combineReducers({
  user,
  signInForm: signInFormMeta.registrar.formReducer(), // inject the standard SignIn form-based reducer
});
