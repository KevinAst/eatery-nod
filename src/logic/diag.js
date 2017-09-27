import {createLogic}  from 'redux-logic';
import handleUnexpectedError from '../util/handleUnexpectedError';

/**
 * Monitor unexpected conditions within the redux dispatch process
 * (where most of our app logic resides) ...
 *    - communicating problem to the user
 *    - and logging the details (for tech support)
 */
export const communicateUnexpectedErrors = createLogic({

  name: 'diag.communicateUnexpectedErrors',
  type: [/\.fail$/,                // ... from app async '*.fail' actions
         'UNHANDLED_LOGIC_ERROR'], // ... from error thrown (via redux-logic error handling)
  
  process({getState, action}, dispatch, done) {

    const err = action.err ||   // ... from app async '*.fail' actions
                action.payload; // ... from redux-logic error handler

    handleUnexpectedError(err);
    done();
  },

});


/**
 * Log each dispatched action, using the following Log levels:
 *   - TRACE:   see dispatched actions
 *   - VERBOSE: see dispatched actions INCLUDING action content (CAUTION: action content can be BIG)
 *
 * ?? retrofit, if used at all
 */
export const logActions = createLogic({

  name: 'diag.logActions',
  type: '*',

  transform({getState, action}, next) {

    // ?? retrofit, if used at all
    console.log('Dispatched Action:', action);
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


// promote all logic (accumulated in index.js)
// ... named exports (above) are used by unit tests :-)
export default [
  communicateUnexpectedErrors,
  logActions,
];
