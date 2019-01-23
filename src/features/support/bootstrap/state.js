import {combineReducers}  from 'redux';
import {reducerHash}      from 'astx-redux-util';
import {slicedReducer}    from 'feature-redux';
import featureName        from './featureName';
import actions            from './actions';


// ***
// *** Our feature reducer, managing state for the bootstrap process.
// ***
const reducer = slicedReducer(featureName, combineReducers({

  // status: string ... bootstrap status - 'Waiting for bla bla bla' -or- 'COMPLETE'
  //                    - VISIBLE in the SplashScreen startup
  //                      ... via selector: getBootstrapStatusMsg(appState)
  //                    - USED to determine when our app is ready to start
  //                      ... via selector: isBootstrapComplete(appState)
  status: reducerHash({
    [actions.setStatus]: (state, action) => action.statusMsg,
  }, 'Waiting for App to start'), // initialState

}) );

export default reducer;


// ***
// *** Various Selectors
// ***

                               /** Our feature state root (via slicedReducer as a single-source-of-truth) */
const getFeatureState        = (appState) => reducer.getSlicedState(appState);
const gfs = getFeatureState;   // ... concise alias (used internally)


                                     /** Is app ready to start (based on our bootstrap status): boolean */
export const isBootstrapComplete   = (appState) => gfs(appState).status === 'COMPLETE';
                                     /** Bootstrap status message: string ('Waiting for bla bla bla' -or- 'COMPLETE') */
export const getBootstrapStatusMsg = (appState) => gfs(appState).status;
