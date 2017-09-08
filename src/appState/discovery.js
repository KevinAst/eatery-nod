import {combineReducers}  from 'redux';
import filter             from './discovery.filter';
import nextPageToken      from './discovery.nextPageToken';
import eateries           from './discovery.eateries';

export default combineReducers({
  filter,
  nextPageToken,
  eateries,
});
