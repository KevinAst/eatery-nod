import {combineReducers}     from 'redux';
import {reducerHash}         from 'astx-redux-util';
import {slicedReducer,
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
const reducer = slicedReducer(`view.${featureName}`, managedExpansion( () => combineReducers({

  // raw eatery entries synced from firebase realtime DB
  dbPool: reducerHash({
    [actions.dbPool.changed]: (state, action) => action.eateries,
  }, null), // initialState

  listView: combineReducers({

    // standard iForm for our EateryFilterForm
    filterForm: eateryFilterFormMeta.registrar.formReducer(),

    // filter used in visualizing listView
    filter: reducerHash({
      [actions.applyFilter]: (state, action) => action.filter,
    }, { // initialState
      distance: null,    // distance in miles (default: null - for any distance)
      sortOrder: 'name', // sortOrder: 'name'/'distance'
    }),

    // filtered entries displayed in visual listView
    entries: reducerHash({
      [actions.applyFilter]: (state, action) => action.entries,
    }, null), // initialState

  }),

  // detailView: eateryId ... id of eatery to "display details for" (null for none)
  detailView: reducerHash({
    [actions.viewDetail]:       (state, action) => action.eateryId,
    [actions.viewDetail.close]: (state, action) => null,
  }, null), // initialState

  // spin: string ... msg to display when spin operation is in place, null for spin NOT in place
  spin: reducerHash({
    [actions.spin]:          (state, action) => action.spinMsg,
    [actions.spin.complete]: (state, action) => null,
  }, null), // initialState

}) ) );

export default reducer;


// ***
// *** Various Selectors
// ***

                                   /** Our feature state root (via slicedReducer as a single-source-of-truth) */
const getFeatureState            = (appState) => reducer.getSlicedState(appState);
const gfs = getFeatureState;       // ... concise alias (used internally)

export const getDbPool           = (appState) => gfs(appState).dbPool;

export const isFormFilterActive  = (appState) => gfs(appState).listView.filterForm ? true : false;
export const getFormFilter       = (appState) => gfs(appState).listView.filterForm;

export const getListViewFilter   = (appState) => gfs(appState).listView.filter;

export const getListViewEntries  = (appState) => gfs(appState).listView.entries;

export const getSelectedEatery   = (appState) => {
  const  selectedEateryId = gfs(appState).detailView;
  return selectedEateryId ? gfs(appState).dbPool[selectedEateryId] : null;
};

export const getSpinMsg          = (appState) => gfs(appState).spin;
