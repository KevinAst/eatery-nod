import {createLogic}        from 'redux-logic';
import eateryFilterFormMeta from './eateryFilterFormMeta';
import featureName          from './featureName';
import * as sel             from './state';
import actions              from './actions';
import {expandWithFassets}  from 'feature-u';
import discloseError        from '../../util/discloseError';

/**
 * Our persistent monitor that manages various aspects of a given pool.
 */
let curPoolMonitor = {   // current "pool" monitor (initially a placebo)
  pool:   null,          // type: string
  wrapUp: () => 'no-op', // type: function(): void ... cleanup existing monitored resources
};

/**
 * This is the primary logic module, which initially loads (and
 * monitors changes) in the real-time DB for the pool eateries of our
 * active user.
 *
 * The key that drives this is the active User.pool identifier.
 * Therefore, we trigger the process off of the 'userProfileChanged'
 * action (where the User.pool is obtained).  This action is emitted:
 *  - on initial startup of our app
 *  - and when the User profile changes (TODO: a future enhancement of the app)
 */
export const monitorDbPool = expandWithFassets( (fassets) => createLogic({

  name:        `${featureName}.monitorDbPool`,
  type:        String(fassets.auth.actions.userProfileChanged), // NOTE: action contains: User object (where we obtain the pool)
  warnTimeout: 0, // long-running logic

  validate({getState, action, fassets}, allow, reject) {

    // no-op if we are alreay monitoring this same pool
    if (action.user.pool === curPoolMonitor.pool) {
      reject(action); // other-logic/middleware/reducers: YES, self's process(): NO
      return;
    }

    // allow self's process()
    allow(action);
  },

  process({getState, action, fassets}, dispatch, done) {

    // close prior monitor
    curPoolMonitor.wrapUp();

    // create new monitor (retaining needed info for subsequent visibility)
    curPoolMonitor = {
      pool:   action.user.pool,
      wrapUp() {
        done();
      }
    };

    // register our real-time DB listener for the set of eateries in our pool
    fassets.eateryService.monitorDbEateryPool(
      action.user.pool,
      fassets.device.sel.getDeviceLoc(getState()),
      (eateries) => {

        // broadcast a notification of a change in our eateries (or the initial population)
        dispatch( actions.dbPool.changed(eateries) );

      });
  },

}) );


/**
 * Default the actions.filterForm.open() domain param from the
 * appState filter.
 */
export const defaultFilter = createLogic({

  name: `${featureName}.defaultFilter`,
  type: String(actions.filterForm.open),

  transform({getState, action, fassets}, next) {
    if (!action.domain) {
      action.domain = sel.getListViewFilter(getState());
    }
    next(action);
  },

});


/**
 * Process eatery filter.
 */
export const processFilter = createLogic({

  name: `${featureName}.processFilter`,
  type: String(actions.filterForm.process),
  
  process({getState, action, fassets}, dispatch, done) {

    // console.log(`xx logic: eatery.processFilter, action is: `, action);
    //   action: {
    //     "domain": {
    //       "distance":  6, // null when NOT supplied
    //       "sortOrder": "name",
    //     },
    //     "type": "eateries.filter.process",
    //     "values": {
    //       "distance": 6, // null when NOT supplied
    //       "sortOrder": "name",
    //     },
    //   }
    
    // show our view
    dispatch( fassets.currentView.actions.changeView(featureName) );

    // close eatery form filter
    dispatch( actions.filterForm.close() );

    done();
  },

});


export const spin = createLogic({

  name: `${featureName}.spin`,
  type: String(actions.spin),

  transform({getState, action, fassets}, next, reject) {

    const appState         = getState();
    const filteredEateries = sel.getFilteredEateries(appState);

    // supplement action with spinMsg
    action.spinMsg = `... selecting your eatery from ${filteredEateries.length} entries!`;
    next(action);
  },

  process({getState, action, fassets}, dispatch, done) {

    setTimeout( () => {

      const appState = getState();
      const filteredEateries  = sel.getFilteredEateries(appState);

      // algorighm from MDN ... https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
      const min      = Math.ceil(0);                        // min is inclusive (in usage below)
      const max      = Math.floor(filteredEateries.length); // max is exclusive (in usage below)
      const randIndx = Math.floor(Math.random() * (max - min)) + min;
      
      const randomEateryId = filteredEateries[randIndx].id;

      dispatch( actions.spin.complete(randomEateryId) );
      done();

    }, 1000);

  },

});

export const spinComplete = createLogic({

  name: `${featureName}.spinComplete`,
  type: String(actions.spin.complete),

  process({getState, action, fassets}, dispatch, done) {
    dispatch( actions.viewDetail(action.eateryId) );
    done();
  },

});


export const addToPoolPrep = createLogic({

  name: `${featureName}.addToPoolPrep`,
  type: String(actions.dbPool.add),

  process({getState, action, fassets}, dispatch, done) {

    fassets.discovery.api.getEateryDetail(action.eateryId)
      .then(eatery => {
        dispatch( actions.dbPool.add.eateryDetail(eatery) );
        done();
      })
      .catch(err => {
        dispatch( actions.dbPool.add.eateryDetail.fail(action.eateryId, err) );
        done();
      });
  },

});



export const addToPool = createLogic({

  name: `${featureName}.addToPool`,
  type: String(actions.dbPool.add.eateryDetail),

  transform({getState, action, fassets}, next, reject) {

    // add the new eatery
    fassets.eateryService.addEatery(action.eatery)
           .catch( (err) => {
             // report unexpected error to user
             discloseError({err});
           });

    next(action);
  },

});


export const removeFromPool = createLogic({

  name: `${featureName}.removeFromPool`,
  type: String(actions.dbPool.remove),

  transform({getState, action, fassets}, next, reject) {

    // remove the supplied eatery
    fassets.eateryService.removeEatery(action.eateryId)
           .catch( (err) => {
             // report unexpected error to user
             discloseError({err});
           });

    next(action);
  },

});


// promote all logic (accumulated in index.js)
// ... named exports (above) are used by unit tests :-)
export default expandWithFassets( (fassets) => [
  monitorDbPool(fassets),
  ...eateryFilterFormMeta.registrar.formLogic(), // inject the standard eatery filter form-based logic modules
  defaultFilter,
  processFilter,
  spin,
  spinComplete,
  addToPoolPrep,
  addToPool,
  removeFromPool,
] );
