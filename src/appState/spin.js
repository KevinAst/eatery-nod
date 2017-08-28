import {reducerHash}  from 'astx-redux-util';
import actions        from '../actions';

// spin: message to display while spin is in-progress
export default reducerHash({
  [actions.eateries.spin]:          (state, action) => action.spinMsg,
  [actions.eateries.spin.complete]: (state, action) => null,
}, null); // initialState
