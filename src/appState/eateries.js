import {combineReducers}  from 'redux';
import dbPool             from './dbPool';
import listView           from './listView';
import detailView         from './detailView';
import spin               from './spin';

export default combineReducers({
  dbPool,
  listView,
  detailView,
  spin,
});
