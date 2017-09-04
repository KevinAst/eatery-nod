import {reducerHash}  from 'astx-redux-util';
import actions        from '../actions';

// view: string (one of 'eateries', 'discovery')
export default reducerHash({
  [actions.view.change]: (state, action) => action.view,
}, 'eateries'); // initialState
