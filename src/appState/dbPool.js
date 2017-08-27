import {reducerHash}  from 'astx-redux-util';
import actions        from '../actions';

// eateries: all restaurants (from our DB Pool), null for NOT available yet
export default reducerHash({
  [actions.eateries.dbPool.changed]: (state, action) => action.eateries,
}, null); // initialState
