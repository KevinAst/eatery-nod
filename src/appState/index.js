import * as Redux     from 'redux';
import {reducerHash}  from 'astx-redux-util'; // ?? eventually don't need
import systemReady    from './systemReady';

// ***
// *** our app's top-level reducer
// ***

// ?? crude start ... trash this when formally defined
const user = reducerHash({
  "login.success":  (state, action) => "valid-uid",
}, null); // initialState

// ?? crude start ... trash this when formally defined
const eateries = reducerHash({
  "eateries.loaded":  (state, action) => (
    { // all restaurants (from simulated DB)
      eateryKey1: {
        name:        'Eatery 1',
        cuisine:     'Mexican',
        price:       '10',
        phone:       '555.1212',
        address:     'Eatery 1 Addr',
        loc: {
          latitude:  1,
          longitude: 2,
        },
        numVisits:   15,
      },
      eateryKey2: {
        name:        'Eatery 2',
        cuisine:     'Chinese',
        price:       '10',
        phone:       '777.2121',
        address:     'Eatery 2 Addr',
        loc: {
          latitude:  3,
          longitude: 4,
        },
        numVisits:   12,
      },
    }
  )
}, null); // initialState

export default appState = Redux.combineReducers({
  systemReady,
  user,
  eateries,
});
