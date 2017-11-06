import actions  from './actions';

/**
 * An app-level life-cycle callback (supporting this 'startup'
 * feature), that bootstrap our app processes (a swift kick to get the
 * ball rolling).
 */
export default function appDidStart({app, appState, dispatch}) {
  dispatch( actions.startup() );
}
