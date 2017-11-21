import {createLogic}        from 'redux-logic';
import firebase             from 'firebase';
import geodist              from 'geodist';
import eateryFilterFormMeta from './eateryFilterFormMeta';
import featureName          from './featureName';
import * as sel             from './state';
import actions              from './actions';
import {managedExpansion}   from '../../util/feature-u';

/**
 * Monitor our persistent data changes associated to a given pool.
 */

let curDbPoolMonitor = { // existing "pool" monitor (if any)
  pool:   null,          // type: string
  dbRef:  null,          // type: firebase.database.Reference
  wrapUp: () => 'no-op', // type: function(): void ... wrap-up monitor (both firebase -and- logic)
};

export const monitorDbPool = managedExpansion( (feature, app) => createLogic({

  name:        `${featureName}.monitorDbPool`,
  type:        String(app.auth.actions.userProfileChanged), // NOTE: action contains: action.userProfile.pool
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
      const deviceLoc = app.startup.selectors.getDeviceLoc(getState());
      for (const eateryId in eateries) {
        const eatery = eateries[eateryId];
        eatery.distance = geodist([eatery.loc.lat, eatery.loc.lng], [deviceLoc.lat, deviceLoc.lng]);
      }

      // broadcast notification of new eateries
      // console.log(`xx logic eateries.monitorDbPool: eateries changed for pool '${curDbPoolMonitor.pool}': `, eateries);
      dispatch( actions.dbPool.changed(eateries) ); // ?? I think this can be eliminated by reselect of filtered entries
    });
  },

}) );


// ?? I think this can be eliminated by reselect of filtered entries
export const postProcessDbPool = createLogic({

  name: `${featureName}.postProcessDbPool`,
  type: String(actions.dbPool.changed),

  process({getState, action, api}, dispatch, done) {
    dispatch( actions.applyFilter() );
    done();
  },

});




/**
 * Default the actions.applyFilter.open() domain param from the
 * appState filter.
 */
export const defaultFilter = createLogic({

  name: `${featureName}.defaultFilter`,
  type: String(actions.applyFilter.open),

  transform({getState, action, api}, next) {
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
  type: String(actions.applyFilter.process),
  
  process({getState, action, app}, dispatch, done) {

    // console.log(`xx logic: eatery.processFilter, action is: `, action);
    //   action: {
    //     "domain": {
    //       "distance":  6, // null when NOT supplied
    //       "sortOrder": "name",
    //     },
    //     "type": "eateries.applyFilter.process",
    //     "values": {
    //       "distance": 6, // null when NOT supplied
    //       "sortOrder": "name",
    //     },
    //   }

    // apply filter
    const filter = action.domain;
    dispatch( actions.applyFilter(filter) );
    
    // show our view view
    dispatch( app.view.actions.changeView(featureName) );

    // close eatery form filter
    dispatch( actions.applyFilter.close() );

    done();
  },

});


// ?? I think this can be eliminated by reselect of filtered entries
export const applyFilter = createLogic({

  name: `${featureName}.applyFilter`,
  type: String(actions.applyFilter),

  transform({getState, action, api}, next, reject) {

    const appState = getState();

    // supplement action filter (when not supplied is taken from state)
    // ... allows us to store latest filter in state
    const filter  = action.filter || sel.getListViewFilter(appState);
    action.filter = filter;

    // apply our filter (either supplied or from state)
    const dbPool  = sel.getDbPool(appState);
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
                          })
                          .map( eatery => eatery.id );

    // supplement action entries (the filtered/sorted end result)
    action.entries = entries;

    next(action);
  },

});


export const spin = createLogic({

  name: `${featureName}.spin`,
  type: String(actions.spin),

  transform({getState, action, api}, next, reject) {

    const appState = getState();
    const entries  = sel.getListViewEntries(appState);

    // supplement action with spinMsg
    action.spinMsg = `... selecting your eatery from ${entries.length} entries!`;
    next(action);
  },

  process({getState, action, api}, dispatch, done) {

    setTimeout( () => {

      const appState = getState();
      const entries  = sel.getListViewEntries(appState);

      // algorighm from MDN ... https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
      const min      = Math.ceil(0);                // min is inclusive (in usage below)
      const max      = Math.floor(entries.length);  // max is exclusive (in usage below)
      const randIndx = Math.floor(Math.random() * (max - min)) + min;
      
      const randomEateryId = entries[randIndx];

      dispatch( actions.spin.complete(randomEateryId) );
      done();

    }, 1000);

  },

});

export const spinComplete = createLogic({

  name: `${featureName}.spinComplete`,
  type: String(actions.spin.complete),

  process({getState, action, api}, dispatch, done) {
    dispatch( actions.viewDetail(action.eateryId) );
    done();
  },

});


export const addToPoolPrep = createLogic({

  name: `${featureName}.addToPoolPrep`,
  type: String(actions.dbPool.add),

  process({getState, action, api}, dispatch, done) {

    api.discovery.getEateryDetail(action.eateryId)
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

  transform({getState, action, api}, next, reject) {

    const appState = getState();
    const pool     = app.auth.sel.getUserPool(appState);

    // console.log(`xx adding eatery: /pools/${pool}/${action.eatery.id}`);
    const dbRef = firebase.database().ref(`/pools/${pool}/${action.eatery.id}`);
    dbRef.set(action.eatery);

    next(action);
  },

});


export const removeFromPool = createLogic({

  name: `${featureName}.removeFromPool`,
  type: String(actions.dbPool.remove),

  transform({getState, action, api}, next, reject) {

    const appState = getState();
    const pool     = app.auth.sel.getUserPool(appState);

    // console.log(`xx removing eatery: /pools/${pool}/${action.eateryId}`);
    const dbRef = firebase.database().ref(`/pools/${pool}/${action.eateryId}`);
    dbRef.set(null);

    next(action);
  },

});


// promote all logic (accumulated in index.js)
// ... named exports (above) are used by unit tests :-)
export default managedExpansion( (feature, app) => [
  monitorDbPool(feature, app),
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
] );
