import {combineReducers}  from 'redux';
import {reducerHash}      from 'astx-redux-util';
import feature            from '.';
import actions            from './actions';
import isString           from 'lodash.isstring';

// ***
// *** 'startup' feature reducer, managing state for our device
// ***

export default combineReducers({

  status: reducerHash({ // string: 'Waiting for bla bla bla' -or- 'READY'
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


// ***
// *** various selectors
// ***

                                     /** Our standard selector accessing the root of our feature state */
export const getFeatureState       = (appState) => feature.reducer.getShapedState(appState); // uses single-source-of-truth from our feature object
const  gfs = getFeatureState;        // ... convenient alias (used internally)


                                     /** Is device ready to run app (based on it's status): boolean */
export const isDeviceReady         = (appState) => gfs(appState).status === 'READY';
                                     /** Device status message: string ('Waiting for bla bla bla' -or- 'READY') */
export const getDeviceStatusMsg    = (appState) => gfs(appState).status;


                                     /** Have fonts been loaded: boolean */
export const areFontsLoaded        = (appState) => gfs(appState).fontsLoaded === true; // NOTE: true check IS REQUIRED, as it can also contain error string
                                     /** Font loading problem message (if any): string (null for no problem) */
export const getFontsLoadedProblem = (appState) => {
  const fontsLoadedMsg = gfs(appState).fontsLoaded;
  return isString(fontsLoadedMsg)
          ? fontsLoadedMsg           // when contains a string, it holds a message highlighting a problem in loading fonts
          : null;                    // otherwise no problem (either waiting for fonts to load (false), or fonts successfully loaded (true)
};


                                     /** Device Location: {lat, lng} */
export const getDeviceLoc            = (appState) => gfs(appState).loc;
