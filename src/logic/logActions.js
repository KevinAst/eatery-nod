import {createLogic}  from 'redux-logic';

/**
 * ?? retrofit, if used at all
 * Log each dispatched action, using the following Log levels:
 *   - TRACE:   see dispatched actions
 *   - VERBOSE: see dispatched actions INCLUDING action content (CAUTION: action content can be BIG)
 */
export default createLogic({

  type: '*',

  transform({getState, action}, next) {

    // ?? retrofit, if used at all
    console.log(`Dispatched Action: ${action.type}`, action);
    // ? // log dispatched action
    // ? if (log.isVerboseEnabled()) {
    // ?   log.verbose(()=> `Dispatched Action: ${FMT(action.type)} with content:\n${FMT(action)}`);
    // ? }
    // ? else {
    // ?   log.trace(()=>   `Dispatched Action: ${FMT(action.type)}`);
    // ? }

    // continue processing
    next(action);
  },

});
