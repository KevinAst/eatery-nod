import {reducerHash}  from 'astx-redux-util';
import actions        from '../actions';

// entries: entries displayed in visual listView
export default reducerHash({
  [actions.eateries.applyFilter]: (state, action) => action.entries,
}, null); // initialState
