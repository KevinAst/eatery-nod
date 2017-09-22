import {reducerHash}  from 'astx-redux-util';
import actions        from '../actions';

// discovery.inProgress: discovery retrieval in-progress (either filtered retrieval, or next page)
//                       null/'retrieve'/'next'
export default reducerHash({

  [actions.discovery.retrieve]:          (state, action) => 'retrieve',
  [actions.discovery.retrieve.complete]: (state, action) => null,
  [actions.discovery.retrieve.fail]:     (state, action) => null,

  [actions.discovery.nextPage]:          (state, action) => 'next',
  [actions.discovery.nextPage.complete]: (state, action) => null,
  [actions.discovery.nextPage.fail]:     (state, action) => null,

}, null);  // initialState
