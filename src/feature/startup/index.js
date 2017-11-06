import {createFeature,
        shapedReducer}  from '../../util/feature-u';
import reducer          from './reducer';
import publicAPI        from './publicAPI';
import logic            from './logic';
import router           from './router';
import appWillStart     from './appWillStart';
import appDidStart      from './appDidStart';

/**
 * The 'startup' feature bootstraps the entire app, getting it
 * up-and-running.
 */
export default createFeature({
  name:     'startup',
  reducer:  shapedReducer(reducer, 'device'),

  publicAPI,

  logic,
  router,

  appWillStart,
  appDidStart,
});
