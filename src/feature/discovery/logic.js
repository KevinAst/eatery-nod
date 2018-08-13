import {createLogic}           from 'redux-logic';
import discoveryFilterFormMeta from './discoveryFilterFormMeta';
import actions                 from './actions';
import featureName             from './featureName';
import * as sel                from './state';
import {expandWithFassets}     from 'feature-u';

/**
 * Initially retrieve discovery eateries, on 'discovery' view change.
 */
export const initialRetrieve = expandWithFassets( (fassets) => createLogic({

  name: `${featureName}.initialRetrieve`,
  type: String(fassets.currentView.actions.changeView),

  process({getState, action, fassets}, dispatch, done) {

    const appState = getState();

    if (action.viewName           === featureName && // ... our view
        sel.getEateries(appState) === null        && // ... discovery eateries in initial state
        !sel.getInProgress(appState)) {              // ... no discovery retrieval is in-progress
      // initial retrieval using default filter (located in our app state)
      const deviceLoc = fassets.device.sel.getDeviceLoc(appState);
      dispatch( actions.retrieve({...sel.getFilter(appState),
                                  loc: [deviceLoc.lat, deviceLoc.lng]}) );
    }

    done();
  },

}) );


/**
 * Default the filter.open() domain param from the appState
 * filter.
 */
export const defaultFilter = createLogic({

  name: `${featureName}.defaultFilter`,
  type: String(actions.filterForm.open),

  transform({getState, action, fassets}, next) {
    if (!action.domain) {
      action.domain = sel.getFilter(getState());
    }
    next(action);
  },

});



/**
 * Process discovery filter.
 */
export const processFilter = createLogic({

  name: `${featureName}.processFilter`,
  type: String(actions.filterForm.process),
  
  process({getState, action, fassets}, dispatch, done) {
    // retrieve using new filter from form
    const appState  = getState();
    const filter    = action.domain;
    const deviceLoc = fassets.device.sel.getDeviceLoc(appState);
    dispatch( actions.retrieve({...filter, 
                                loc: [deviceLoc.lat, deviceLoc.lng]}) );
    
    // show our view view
    dispatch( fassets.currentView.actions.changeView(featureName) );

    // close our form filter
    dispatch( actions.filterForm.close() );

    done();
  },

});


/**
 * Perform discovery retrieval.
 */
export const retrieve = createLogic({

  name: `${featureName}.retrieve`,
  type: String(actions.retrieve),
  warnTimeout: 0, // long-running logic ... UNFORTUNATELY GooglePlaces is sometimes EXCRUCIATINGLY SLOW!

  process({getState, action, fassets}, dispatch, done) {

    fassets.discovery.api.searchEateries(action.filter)
       .then(resp => {
         // console.log(`xx here is our response: `, resp);
         dispatch( actions.retrieve.complete(action.filter, resp) );
         done();
       })
       .catch(err => {
         console.log(`*** ERROR *** googlePlacesAPI nearBySearch ... ${''+err}`);
         dispatch( actions.retrieve.fail(err) );
         done();
       });
  },

});



/**
 * Perform next-page discovery retrieval.
 */
export const nextPage = createLogic({

  name: `${featureName}.nextPage`,
  type: String(actions.nextPage),

  process({getState, action, fassets}, dispatch, done) {

    fassets.discovery.api.searchEateriesNextPage(action.pagetoken)
       .then(resp => {
         // console.log(`xx here is our response: `, resp);
         dispatch( actions.nextPage.complete(resp) );
         done();
       })
       .catch(err => {
         console.log(`*** ERROR *** googlePlacesAPI nearBySearch ... ${''+err}`);
         dispatch( actions.nextPage.fail(err) );
         done();
       });
  },

});


// promote all logic (accumulated in index.js)
// ... named exports (above) are used by unit tests :-)
export default expandWithFassets( (fassets) => [
  ...discoveryFilterFormMeta.registrar.formLogic(), // discoveryFilter iForm logic modules
  defaultFilter,
  initialRetrieve(fassets),
  processFilter,
  retrieve,
  nextPage,
] );
