import {combineReducers}  from 'redux';
import deviceCredentials  from './deviceCredentials';
import signInFormMeta     from '../logic/iForms/signInFormMeta';
import actions            from '../actions';

export default combineReducers({
  deviceCredentials,
  signInForm: signInFormMeta.registrar.formReducer(actions.auth.interactiveSignIn), // inject the standard SignIn form-based reducer
});
