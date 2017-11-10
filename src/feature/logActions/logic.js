import {createLogic}      from 'redux-logic';
import {injectContext}    from '../../util/feature-u';

/**
 * Log all dispatched actions.
 *
 * TODO: retrofit to use real logger:
 *       using the following Log levels:
 *         - TRACE:   see dispatched actions
 *         - VERBOSE: see dispatched actions INCLUDING action content (CAUTION: action content can be BIG)
 */
export const actionLogger = injectContext( (feature, app) => createLogic({

  name: `${feature.name}.actionLogger`,
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

}) );


// promote all logic modules for this feature
// ... NOTE: individual logic modules are unit tested using the named exports.
export default injectContext( (feature, app) => [
  actionLogger(feature, app),
]);
