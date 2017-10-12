import {createLogic}  from 'redux-logic';
import firebase       from 'firebase';
import geodist        from 'geodist';
import eateryFilterFormMeta from './iForms/eateryFilterFormMeta';
import actions        from '../actions';


/**
 * Monitor our persistent data changes associated to a given pool.
 */

let curDbPoolMonitor = { // existing "pool" monitor (if any)
  pool:   null,          // type: string
  dbRef:  null,          // type: firebase.database.Reference
  wrapUp: () => 'no-op', // type: function(): void ... wrap-up monitor (both firebase -and- logic)
};

export const monitorDbPool = createLogic({

  name:        'eateries.monitorDbPool',
  type:        String(actions.profile.changed), // NOTE: action contains: action.userProfile.pool
  warnTimeout: 0, // long-running logic

  validate({getState, action, api}, allow, reject) {

    // no-op if we are alreay monitoring this same pool
    if (action.userProfile.pool === curDbPoolMonitor.pool) {
      reject(action); // other-logic/middleware/reducers: YES, self's process(): NO
      return;
    }

    // allow self's process()
    allow(action);
  },

  process({getState, action, api}, dispatch, done) {

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
      const deviceLoc = getState().device.loc;
      for (const eateryId in eateries) {
        const eatery = eateries[eateryId];
        eatery.distance = geodist([eatery.loc.lat, eatery.loc.lng], [deviceLoc.lat, deviceLoc.lng]);
      }

      // broadcast notification of new eateries
      // console.log(`xx logic eateries.monitorDbPool: eateries changed for pool '${curDbPoolMonitor.pool}': `, eateries);
      dispatch( actions.eateries.dbPool.changed(eateries) );
    });
  },

});


export const postProcessDbPool = createLogic({

  name: 'eateries.postProcessDbPool',
  type: String(actions.eateries.dbPool.changed),

  process({getState, action, api}, dispatch, done) {
    dispatch( actions.eateries.applyFilter() );
    done();
  },

});




/**
 * Default the eateries.applyFilter.open() domain param from the
 * appState filter.
 */
export const defaultFilter = createLogic({

  name: 'eatery.defaultFilter',
  type: String(actions.eateries.applyFilter.open),

  transform({getState, action, api}, next) {
    if (!action.domain) {
      action.domain = getState().eateries.listView.filter;
    }
    next(action);
  },

});


/**
 * Process eatery filter.
 */
export const processFilter = createLogic({

  name: 'eatery.processFilter',
  type: String(actions.eateries.applyFilter.process),
  
  process({getState, action, api}, dispatch, done) {

    // console.log(`xx logic: eatery.processFilter, action is: `, action);
    //   action: {
    //     "domain": {
    //       "distance": 6, // null when NOT supplied
    //     },
    //     "type": "eateries.applyFilter.process",
    //     "values": {
    //       "distance": 6, // null when NOT supplied
    //     },
    //   }

    // apply filter
    const filter = action.domain;
    dispatch( actions.eateries.applyFilter(filter) );
    
    // show 'eatery' view
    dispatch( actions.view.change('eateries') );

    // close eatery form filter
    dispatch( actions.eateries.applyFilter.close() );

    done();
  },

});


export const applyFilter = createLogic({

  name: 'eateries.applyFilter',
  type: String(actions.eateries.applyFilter),

  transform({getState, action, api}, next, reject) {

    const appState = getState();

    // supplement action filter (when not supplied is taken from state)
    // ... allows us to store latest filter in state
    const filter  = action.filter || appState.eateries.listView.filter;
    action.filter = filter;

    // apply our filter (either supplied or from state)
    const dbPool  = appState.eateries.dbPool;
    const entries = Object.values(dbPool)
                          .filter(entry => { // filter entries
                            // apply distance (when supplied in filter)
                            return filter.distance ? entry.distance <= filter.distance : true;
                          })
                          .sort((e1, e2) => { // sort entries
                            // ... order by distance (when supplied)
                            let order = filter.distance ? e1.distance-e2.distance : 0;
                            // ... order by name - either secondary (within distance), or primary (when no distance)
                            if (order === 0)
                              order = e1.name.localeCompare(e2.name);
                            return order;
                          })
                          .map( eatery => eatery.id );

    // supplement action entries (the filtered/sorted end result)
    action.entries = entries;

    next(action);
  },

});


export const spin = createLogic({

  name: 'eateries.spin',
  type: String(actions.eateries.spin),

  transform({getState, action, api}, next, reject) {

    const appState = getState();
    const entries  = appState.eateries.listView.entries;

    // supplement action with spinMsg
    action.spinMsg = `... selecting your eatery from ${entries.length} entries!`;
    next(action);
  },

  process({getState, action, api}, dispatch, done) {

    setTimeout( () => {

      const appState = getState();
      const entries  = appState.eateries.listView.entries;

      // algorighm from MDN ... https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
      const min      = Math.ceil(0);                // min is inclusive (in usage below)
      const max      = Math.floor(entries.length);  // max is exclusive (in usage below)
      const randIndx = Math.floor(Math.random() * (max - min)) + min;
      
      const randomEateryId = entries[randIndx];

      dispatch( actions.eateries.spin.complete(randomEateryId) );
      done();

    }, 1000);

  },

});

export const spinComplete = createLogic({

  name: 'eateries.spinComplete',
  type: String(actions.eateries.spin.complete),

  process({getState, action, api}, dispatch, done) {
    dispatch( actions.eateries.viewDetail(action.eateryId) );
    done();
  },

});


export const addToPoolPrep = createLogic({

  name: 'eateries.addToPoolPrep',
  type: String(actions.eateries.dbPool.add),

  process({getState, action, api}, dispatch, done) {

    api.discovery.getEateryDetail(action.eateryId)
      .then(eatery => {
        dispatch( actions.eateries.dbPool.add.eateryDetail(eatery) );
        done();
      })
      .catch(err => {
        dispatch( actions.eateries.dbPool.add.eateryDetail.fail(action.eateryId, err) );
        done();
      });
  },

});



export const addToPool = createLogic({

  name: 'eateries.addToPool',
  type: String(actions.eateries.dbPool.add.eateryDetail),

  transform({getState, action, api}, next, reject) {

    const appState = getState();
    const pool     = appState.auth.user.pool;

    // console.log(`xx adding eatery: /pools/${pool}/${action.eatery.id}`);
    const dbRef = firebase.database().ref(`/pools/${pool}/${action.eatery.id}`);
    dbRef.set(action.eatery);

    next(action);
  },

});


export const removeFromPool = createLogic({

  name: 'eateries.removeFromPool',
  type: String(actions.eateries.dbPool.remove),

  transform({getState, action, api}, next, reject) {

    const appState = getState();
    const pool     = appState.auth.user.pool;

    // console.log(`xx removing eatery: /pools/${pool}/${action.eateryId}`);
    const dbRef = firebase.database().ref(`/pools/${pool}/${action.eateryId}`);
    dbRef.set(null);

    next(action);
  },

});


// promote all logic (accumulated in index.js)
// ... named exports (above) are used by unit tests :-)
export default [
  monitorDbPool,
  postProcessDbPool,
  ...eateryFilterFormMeta.registrar.formLogic(), // inject the standard eatery filter form-based logic modules
  defaultFilter,
  processFilter,
  applyFilter,
  spin,
  spinComplete,
  addToPoolPrep,
  addToPool,
  removeFromPool,
];
