import {combineReducers}  from 'redux';
import {reducerHash}      from 'astx-redux-util'; // ?? eventually don't need
import systemReady        from './systemReady';
import auth               from './auth';
import view               from './view';
import eateries           from './eateries';
import discovery          from './discovery';

// ***
// *** our app's top-level reducer
// ***

export default combineReducers({
  systemReady,
  auth,
  view,
  eateries,
  discovery,
});
