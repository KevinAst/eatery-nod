import featureName from './featureName';

/**
 * An app-level life-cycle hook that defaults the app view to be self.
 */
export default function appDidStart({fassets, appState, dispatch}) {
  dispatch( fassets.currentView.actions.changeView(featureName) );
}
