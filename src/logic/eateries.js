import {createLogic}  from 'redux-logic';
import firebase       from 'firebase';
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


export const applyFilter = createLogic({

  name: 'eateries.applyFilter',
  type: String(actions.eateries.applyFilter),

  transform({getState, action, api}, next, reject) {

    const appState = getState();
    const filter   = action.filter || appState.eateries.listView.filter;

    // apply listView filter (either supplied or from state),
    // supplementing our action with end result (entries)
    // TODO: apply filter, for now simply pass through all
    const dbPool  = appState.eateries.dbPool;
    const entries = Object.values(dbPool).map( eatery => eatery.id );
    action.entries = entries;
    next(action);
  },

});



// promote all logic (accumulated in index.js)
// ... named exports (above) are used by unit tests :-)
export default [
  monitorDbPool,
  postProcessDbPool,
  applyFilter,
];
