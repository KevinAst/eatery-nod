import {combineReducers}        from 'redux';
import {reducerHash}            from 'astx-redux-util';
import {expandWithFassets}      from 'feature-u';
import {slicedReducer}          from 'feature-redux';
import featureName              from './featureName';
import discoveryFilterFormMeta  from './discoveryFilterFormMeta';
import actions                  from './actions';

// ***
// *** Our feature reducer, managing state for our discovery process.
// ***

// NOTE: expandWithFassets() is used NOT for app injection,
//       but RATHER to delay expansion (avoiding circular dependancies
//       in selector access from discoveryFilterFormMeta.js)
const reducer = slicedReducer(`view.${featureName}`, expandWithFassets( () => combineReducers({

  // retrieval in-progress (used by BOTH filtered retrieval, and next page)
  // ... null/'retrieve'/'next'
  inProgress: reducerHash({

    [actions.retrieve]:          (state, action) => 'retrieve',
    [actions.retrieve.complete]: (state, action) => null,
    [actions.retrieve.fail]:     (state, action) => null,

    [actions.nextPage]:          (state, action) => 'next',
    [actions.nextPage.complete]: (state, action) => null,
    [actions.nextPage.fail]:     (state, action) => null,

  }, null),  // initialState

  // standard iForm reducer for our DiscoveryFilterForm
  filterForm: discoveryFilterFormMeta.registrar.formReducer(),

  // selection criteria (filter)
  filter: reducerHash({
    [actions.retrieve.complete]: (state, action) => action.filter,
  }, { // initialState
    searchText: '',
    distance:   10,
    minprice:   '1',
  }),

  // next page token (for paging)
  nextPageToken: reducerHash({
    [actions.retrieve.complete]: (state, action) => action.discoveriesResp.pagetoken,
    [actions.nextPage.complete]: (state, action) => action.discoveriesResp.pagetoken,
  }, null), // initialState

  // discoveries (data records)
  discoveries: reducerHash({
    [actions.retrieve.complete]: (state, action) => action.discoveriesResp.discoveries,
    [actions.nextPage.complete]: (state, action) => [...state, ...action.discoveriesResp.discoveries], // append to state
  }, null), // initialState

}) ) );

export default reducer;


// ***
// *** Various Selectors
// ***

                                   /** Our feature state root (via slicedReducer as a single-source-of-truth) */
const getFeatureState            = (appState) => reducer.getSlicedState(appState);
const gfs = getFeatureState;       // ... concise alias (used internally)

export const getInProgress       = (appState) => gfs(appState).inProgress;

export const isFormFilterActive  = (appState) => gfs(appState).filterForm ? true : false;
export const getFormFilter       = (appState) => gfs(appState).filterForm;

export const getFilter           = (appState) => gfs(appState).filter;

export const getNextPageToken    = (appState) => gfs(appState).nextPageToken;

export const getDiscoveries      = (appState) => gfs(appState).discoveries;