import {combineReducers}     from 'redux';
import {reducerHash}         from 'astx-redux-util';
import eateryFilterFormMeta  from '../logic/iForms/eateryFilterFormMeta';
import actions               from '../actions';

export default combineReducers({

  filterForm: eateryFilterFormMeta.registrar.formReducer(), // standard iForm reducer for our EateryFilterForm

  filter: reducerHash({ // filter applied to visual listView
    [actions.eateries.applyFilter]: (state, action) => action.filter,
  }, { // initialState
    distance: null,    // distance in miles (default: null - for any distance)
    sortOrder: 'name', // sortOrder: 'name'/'distance'
  }),

  entries: reducerHash({ // filtered entries displayed in visual listView
    [actions.eateries.applyFilter]: (state, action) => action.entries,
  }, null), // initialState

});
