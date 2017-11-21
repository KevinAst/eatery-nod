import {combineReducers}     from 'redux';
import {reducerHash}         from 'astx-redux-util';
import {shapedReducer,
        managedExpansion}    from '../../util/feature-u';
import featureName           from './featureName';
import eateryFilterFormMeta  from './eateryFilterFormMeta';
import actions               from './actions';

// ***
// *** Our feature reducer, managing state for our eateries process.
// ***

// NOTE: managedExpansion() is used NOT for app injection,
//       but RATHER to delay expansion (avoiding circular dependancies
//       in selector access from eateryFilterFormMeta.js)
// ?? once selectors are in place ... change shape to: `view.${featureName}`
const reducer = shapedReducer(featureName, managedExpansion( () => combineReducers({

  dbPool: reducerHash({
    [actions.dbPool.changed]: (state, action) => action.eateries,
  }, null), // initialState

  listView: combineReducers({

    filterForm: eateryFilterFormMeta.registrar.formReducer(), // standard iForm reducer for our EateryFilterForm

    filter: reducerHash({ // filter applied to visual listView
      [actions.applyFilter]: (state, action) => action.filter,
    }, { // initialState
      distance: null,    // distance in miles (default: null - for any distance)
         sortOrder: 'name', // sortOrder: 'name'/'distance'
    }),

    entries: reducerHash({ // filtered entries displayed in visual listView
      [actions.applyFilter]: (state, action) => action.entries,
    }, null), // initialState

  }),

  detailView: reducerHash({
    [actions.viewDetail]:       (state, action) => action.eateryId,
    [actions.viewDetail.close]: (state, action) => null,
  }, null), // initialState

  spin: reducerHash({
    [actions.spin]:          (state, action) => action.spinMsg,
    [actions.spin.complete]: (state, action) => null,
  }, null), // initialState

}) ) );

export default reducer;


// ***
// *** Various Selectors
// ***

                                     /** Our feature state root (via shapedReducer as a single-source-of-truth) */
const getFeatureState              = (appState) => reducer.getShapedState(appState);
const gfs = getFeatureState;         // ... concise alias (used internally)

// ?? TRASH TEMPLATE
//? export const getUserStatus             = (appState) => gfs(appState).user.status;
//? export const isUserUnverifiedSignedIn  = (appState) => getUserStatus(appState) === 'signedInUnverified';
//? export const isUserSignedIn            = (appState) => getUserStatus(appState) === 'signedIn';
//? export const isUserSignedOut           = (appState) => getUserStatus(appState) === 'signedOut';
//? 
//? export const isSignInFormActive        = (appState) => gfs(appState).signInForm ? true : false;
//? 
//? export const getUserName               = (appState) => gfs(appState).user.name;
//? export const getUserEmail              = (appState) => gfs(appState).user.email;
//? export const getUserPool               = (appState) => gfs(appState).user.pool;
//? 
//? export const getUserSignInForm         = (appState) => gfs(appState).signInForm;
