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
      dispatch( actions.eateries.changed(eateries) );
    });
  },

});



// promote all logic (accumulated in index.js)
// ... named exports (above) are used by unit tests :-)
export default [
  monitorDbPool,
];
