import {reducerHash}  from 'astx-redux-util';
import actions        from '../actions';

// discovery.filter: discovery selection criteria (filter)
export default reducerHash({
  [actions.discovery.retrieve.complete]: (state, action) => action.filter,
}, 
{ // initialState
  searchText: '',
  distance:   10,
});
