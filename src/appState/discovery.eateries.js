import {reducerHash}  from 'astx-redux-util';
import actions        from '../actions';

// discovery.eateries: discovery eateries (data records)
export default reducerHash({
  [actions.discovery.retrieve]:          (state, action) => null, // retrieval in-progress
  [actions.discovery.retrieve.complete]: (state, action) => action.eateriesResp.eateries,

  [actions.discovery.nextPage.complete]: (state, action) => [...state, ...action.eateriesResp.eateries], // append to state
}, null); // initialState
