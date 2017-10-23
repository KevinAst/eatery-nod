import {combineReducers}  from 'redux';
import {reducerHash}      from 'astx-redux-util';
import actions            from './actions';

// ***
// *** 'startup' feature state for our device
// ***

export default combineReducers({

  status: reducerHash({ // string: 'Waiting for bla bla bla', 'READY'
    [actions.startup.statusUpdate]: (state, action) => action.statusMsg,
  }, 'Waiting for App to start'), // initialState

  fontsLoaded: reducerHash({
    [actions.startup.loadFonts.complete]: (state, action) => true,
    [actions.startup.loadFonts.fail]:     (state, action) => 'Device fonts could NOT be loaded :-('
  }, false), // initialState

  loc: reducerHash({ // loc: {lat, lng}
    [actions.startup.locateDevice.complete]: (state, action) => action.loc,
  }, null), // initialState

});
