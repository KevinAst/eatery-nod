import actions  from './actions';

/**
 * An app-level life-cycle hook that bootstraps our app (a swift
 * kick to get the ball rolling).
 */
export default function appDidStart({app, appState, dispatch}) {
  dispatch( actions.bootstrap() );
}
