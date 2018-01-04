import {combineReducers}     from 'redux';
import {reducerHash}         from 'astx-redux-util';
import {slicedReducer}       from '../../util/feature-u/aspect/feature-u-redux';
import {managedExpansion}    from '../../util/feature-u';
import {createSelector}      from 'reselect';
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
      [actions.filter.process]: (state, action) => action.domain,
    }, { // initialState
      distance: null,    // distance in miles (default: null - for any distance)
      sortOrder: 'name', // sortOrder: 'name'/'distance'
    }),

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

export const getFilteredEateries  = createSelector(
  getDbPool,
  getListViewFilter,
  (dbPool, filter) => {

    if (!dbPool) {
      return null; // NO dbPool yet ... waiting for pool entries
    }

    // apply filter to dbPool
    // filteredEateries: Eatery[]
    const entries = Object.values(dbPool)
                          .filter(entry => { // filter entries
                            // apply distance (when supplied in filter)
                            return filter.distance ? entry.distance <= filter.distance : true;
                          })
                          .sort((e1, e2) => { // sort entries
                            // ... order by distance (when requested)
                            let order = filter.sortOrder==='distance' ? e1.distance-e2.distance : 0;
                            // ... order by name - either secondary (within distance), or primary (when no distance)
                            if (order === 0)
                              order = e1.name.localeCompare(e2.name);
                            return order;
                          });

    return entries;
  }
);

export const getSelectedEatery   = (appState) => {
  const  selectedEateryId = gfs(appState).detailView;
  return selectedEateryId ? gfs(appState).dbPool[selectedEateryId] : null;
};

export const getSpinMsg          = (appState) => gfs(appState).spin;
