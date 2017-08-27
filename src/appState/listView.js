import {combineReducers}  from 'redux';
import filter             from './filter';
import entries            from './entries';

export default combineReducers({
  filter,
  entries,
});
