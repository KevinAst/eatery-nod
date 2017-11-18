import {createLogic}      from 'redux-logic';
import featureName        from './featureName';

let lastState = null;

/**
 * Log all dispatched actions.
 *
 * TODO: retrofit to use real logger:
 *       using the following Log levels:
 *         - TRACE:   see dispatched actions
 *         - VERBOSE: see dispatched actions INCLUDING action content (CAUTION: action content can be BIG)
 */
export const actionLogger = createLogic({

  name: `${featureName}.actionLogger`,
  type: '*', // monitor ALL action types

  transform({getState, action}, next) {

    console.log('Dispatched Action:', action);

    // TODO: retrofit to use log-u:
    // // log dispatched action
    // if (log.isVerboseEnabled()) {
    //   log.verbose(()=> `Dispatched Action: ${FMT(action.type)} with content:\n${FMT(action)}`);
    // }
    // else {
    //   log.trace(()=>   `Dispatched Action: ${FMT(action.type)}`);
    // }

    // continue processing
    next(action);
  },

  process({getState, action, app}, dispatch, done) {
    const curState = getState();
    if (curState === lastState) {
      console.log('Current State: UNCHANGED');
    }
    else {
      console.log('Current State:', curState);
    }
    lastState = curState;
    done();
  },

});


// promote all logic modules for this feature
// ... NOTE: individual logic modules are unit tested using the named exports.
export default [
  actionLogger,
];
