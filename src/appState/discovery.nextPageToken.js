import {reducerHash}  from 'astx-redux-util';
import actions        from '../actions';

// discovery.nextPageToken: discovery next page token (for paging)
export default reducerHash({
  [actions.discovery.retrieve.complete]: (state, action) => action.eateriesResp.pagetoken,
  [actions.discovery.nextPage.complete]: (state, action) => action.eateriesResp.pagetoken,
}, null); // initialState
