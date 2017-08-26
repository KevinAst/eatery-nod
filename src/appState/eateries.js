import {reducerHash}  from 'astx-redux-util';
import actions        from '../actions';

// eateries: all restaurants (from DB), null for NOT available yet
export default reducerHash({
  [actions.eateries.changed]: (state, action) => action.eateries,
}, null); // initialState
