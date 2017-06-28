import {reducerHash}  from 'astx-redux-util';
import actions        from '../actions';

export default reducerHash({

  [actions.system.bootstrap.complete]: (state, action) => true,

  [actions.system.bootstrap.fail]:     (state, action) => 'Device resources could NOT be loaded :-(',

}, false); // initialState
