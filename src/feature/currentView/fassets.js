import actions  from './actions';
import * as sel from './state';

/**
 * The Public Face promoted by this feature.
 */
export default {
  define: {
    'currentView.actions.changeView': actions.changeView, // changeView(viewName)

    'currentView.sel.getView': sel.getView, // getView(appState): string
  },
};
