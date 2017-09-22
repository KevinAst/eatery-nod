import {createLogic}           from 'redux-logic';
import discoveryFilterFormMeta from './iForms/discoveryFilterFormMeta';
import actions                 from '../actions';


/**
 * Initially retrieve discovery eateries, on 'discovery' view change.
 */
export const initialize = createLogic({

  name: 'discovery.initialize',
  type: String(actions.view.change),

  process({getState, action, api}, dispatch, done) {

    const appState = getState();

    if (action.view                 === 'discovery' && // ... discovery view
        appState.discovery.eateries === null        && // ... discovery eateries in initial state
        !appState.discovery.inProgress) {              // ... no in-progress discovery retrieval
      // initial retrieval using default filter (located in our app state)
      dispatch( actions.discovery.retrieve({...appState.discovery.filter, loc: [38.752209, -89.986610]}) ); // TODO: loc temp hard-coded to Glen Carbon
    }

    done();
  },

});


/**
 * Process discovery filter.
 */
export const processFilter = createLogic({

  name: 'discovery.processFilter',
  type: String(actions.discovery.filter.process),
  
  process({getState, action, api}, dispatch, done) {
    // retrieve using new filter from form
    const filter = action.domain;
    dispatch( actions.discovery.retrieve({...filter, loc: [38.752209, -89.986610]}) ); // TODO: loc temp hard-coded to Glen Carbon
    
    // show 'discovery' view
    dispatch( actions.view.change('discovery') );

    // close discovery form filter
    dispatch( actions.discovery.filter.close() );

    done();
  },

});


/**
 * Perform discovery retrieval.
 */
export const retrieve = createLogic({

  name: 'discovery.retrieve',
  type: String(actions.discovery.retrieve),

  process({getState, action, api}, dispatch, done) {

    api.discovery.searchEateries(action.filter)
       .then(resp => {
         // console.log(`xx here is our response: `, resp);
         dispatch( actions.discovery.retrieve.complete(action.filter, resp) );
         done();
       })
       .catch(err => {
         console.log(`*** ERROR *** googlePlacesAPI nearBySearch ... ${''+err}`);
         dispatch( actions.discovery.retrieve.fail(err) );
         done();
       });
  },

});



/**
 * Perform next-page discovery retrieval.
 */
export const nextPage = createLogic({

  name: 'discovery.nextPage',
  type: String(actions.discovery.nextPage),

  process({getState, action, api}, dispatch, done) {

    api.discovery.searchEateriesNextPage(action.pagetoken)
       .then(resp => {
         // console.log(`xx here is our response: `, resp);
         dispatch( actions.discovery.nextPage.complete(resp) );
         done();
       })
       .catch(err => {
         console.log(`*** ERROR *** googlePlacesAPI nearBySearch ... ${''+err}`);
         dispatch( actions.discovery.nextPage.fail(err) );
         done();
       });
  },

});


// promote all logic (accumulated in index.js)
// ... named exports (above) are used by unit tests :-)
export default [
  ...discoveryFilterFormMeta.registrar.formLogic(), // discoveryFilter iForm logic modules
  initialize,
  processFilter,
  retrieve,
  nextPage,
];
