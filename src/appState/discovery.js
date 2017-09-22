import {combineReducers}        from 'redux';
import inProgress               from './discovery.inProgress';
import discoveryFilterFormMeta  from '../logic/iForms/discoveryFilterFormMeta';
import filter                   from './discovery.filter';
import nextPageToken            from './discovery.nextPageToken';
import eateries                 from './discovery.eateries';

export default combineReducers({
  inProgress,
  filterForm: discoveryFilterFormMeta.registrar.formReducer(), // standard iForm reducer for our DiscoveryFilterForm
  filter,
  nextPageToken,
  eateries,
});
