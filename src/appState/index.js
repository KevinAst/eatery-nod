import {combineReducers}  from 'redux';
import device             from './device';
import auth               from './auth';
import view               from './view';
import eateries           from './eateries';
import discovery          from './discovery';

// ***
// *** our app's top-level reducer
// ***

export default combineReducers({
  device,
  auth,
  view,
  eateries,
  discovery,
});
