import {reducerHash}  from 'astx-redux-util';
import actions        from '../actions';

// detailView: entry detail displayed in visual detailView
export default reducerHash({
  [actions.eateries.viewDetail]:       (state, action) => action.eateryId,
  [actions.eateries.viewDetail.close]: (state, action) => null,
}, null); // initialState
