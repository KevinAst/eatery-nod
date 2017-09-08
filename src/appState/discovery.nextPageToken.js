import {reducerHash}  from 'astx-redux-util';
import actions        from '../actions';

// discovery.nextPageToken: discovery next page token (for paging)
export default reducerHash({
  [actions.discovery.retrieve]:          (state, action) => null, // retrieval in-progress (no next page yet)
  [actions.discovery.retrieve.complete]: (state, action) => action.eateriesResp.pagetoken,
}, null); // initialState
