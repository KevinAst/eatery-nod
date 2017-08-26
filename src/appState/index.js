import {combineReducers}  from 'redux';
import {reducerHash}      from 'astx-redux-util'; // ?? eventually don't need
import systemReady        from './systemReady';
import auth               from './auth';
import eateries           from './eateries';

// ***
// *** our app's top-level reducer
// ***

export default combineReducers({
  systemReady,
  auth,
  eateries,
});
