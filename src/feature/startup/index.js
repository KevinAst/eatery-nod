import {createFeature,
        shapedReducer}  from '../../util/feature-u';
import name             from './featureName';
import reducer          from './state';
import publicAPI        from './publicAPI';
import logic            from './logic';
import router           from './router';
import appWillStart     from './appWillStart';
import appDidStart      from './appDidStart';


/**
 * The 'startup' feature bootstraps our entire app, getting it
 * up-and-running.
 */
export default createFeature({
  name,
  reducer:  shapedReducer(reducer, 'device'),

  publicAPI,

  logic,
  router,

  appWillStart,
  appDidStart,
});
