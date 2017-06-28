import {combineReducers}  from 'redux';
import deviceCredentials  from './deviceCredentials';
import signInForm         from './signInForm';

export default combineReducers({
  deviceCredentials,
  signInForm,
});
