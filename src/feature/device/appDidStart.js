import actions  from './actions';

/**
 * An app-level life-cycle hook that dispatches our bootstrap action
 * that gets the ball rolling!
 */
export default function appDidStart({app, appState, dispatch}) {
  dispatch( actions.bootstrap() );
}
