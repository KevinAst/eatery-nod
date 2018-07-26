import {createLogic}        from 'redux-logic';
import firebase             from 'firebase';
import geodist              from 'geodist';
import eateryFilterFormMeta from './eateryFilterFormMeta';
import featureName          from './featureName';
import * as sel             from './state';
import actions              from './actions';
import {managedExpansion}   from 'feature-u';

/**
 * Monitor our persistent data changes associated to a given pool.
 */

let curDbPoolMonitor = { // existing "pool" monitor (if any)
  pool:   null,          // type: string
  dbRef:  null,          // type: firebase.database.Reference
  wrapUp: () => 'no-op', // type: function(): void ... wrap-up monitor (both firebase -and- logic)
};

export const monitorDbPool = managedExpansion( (fassets) => createLogic({

  name:        `${featureName}.monitorDbPool`,
  type:        String(fassets.auth.actions.userProfileChanged), // NOTE: action contains: action.userProfile.pool
  warnTimeout: 0, // long-running logic

  validate({getState, action, fassets}, allow, reject) {

    // no-op if we are alreay monitoring this same pool
    if (action.userProfile.pool === curDbPoolMonitor.pool) {
      reject(action); // other-logic/middleware/reducers: YES, self's process(): NO
      return;
    }

    // allow self's process()
    allow(action);
  },

  process({getState, action, fassets}, dispatch, done) {

    // close prior monitor, if any (both firebase -and- logic)
    curDbPoolMonitor.wrapUp();

    // create new monitor (retaining needed info for subsequent visibility)
    curDbPoolMonitor = {
      pool:   action.userProfile.pool,
      dbRef:  firebase.database().ref(`/pools/${action.userProfile.pool}`),
      wrapUp() { // ... hook to wrap-up monitor (both firebase -and- logic)
        curDbPoolMonitor.dbRef.off('value');
        done();
      }
    };

    // register our firebase listener
    curDbPoolMonitor.dbRef.on('value', (snapshot) => {

      const eateries = snapshot.val();

      // supplement eateries with distance from device (as the crow flies)
      const deviceLoc = fassets.device.sel.getDeviceLoc(getState());
      for (const eateryId in eateries) {
        const eatery = eateries[eateryId];
        eatery.distance = geodist([eatery.loc.lat, eatery.loc.lng], [deviceLoc.lat, deviceLoc.lng]);
      }

      // broadcast notification of new eateries
      // console.log(`xx logic eateries.monitorDbPool: eateries changed for pool '${curDbPoolMonitor.pool}': `, eateries);
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

    const appState = getState();
    const pool     = fassets.auth.sel.getUserPool(appState);

    // console.log(`xx adding eatery: /pools/${pool}/${action.eatery.id}`);
    const dbRef = firebase.database().ref(`/pools/${pool}/${action.eatery.id}`);
    dbRef.set(action.eatery);

    next(action);
  },

});


export const removeFromPool = createLogic({

  name: `${featureName}.removeFromPool`,
  type: String(actions.dbPool.remove),

  transform({getState, action, fassets}, next, reject) {

    const appState = getState();
    const pool     = fassets.auth.sel.getUserPool(appState);

    // console.log(`xx removing eatery: /pools/${pool}/${action.eateryId}`);
    const dbRef = firebase.database().ref(`/pools/${pool}/${action.eateryId}`);
    dbRef.set(null);

    next(action);
  },

});


// promote all logic (accumulated in index.js)
// ... named exports (above) are used by unit tests :-)
export default managedExpansion( (fassets) => [
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
