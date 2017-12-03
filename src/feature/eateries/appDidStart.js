import featureName from './featureName';

/**
 * An app-level life-cycle hook that defaults the app view to be self.
 */
export default function appDidStart({app, appState, dispatch}) {
  dispatch( app.currentView.actions.changeView(featureName) );
}
