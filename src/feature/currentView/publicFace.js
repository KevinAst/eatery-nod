import actions  from './actions';
import * as sel from './state';

/**
 * The publicFace promoted by this feature through: app.currentView...
 */
export default {
  actions: {
    changeView: actions.changeView, // changeView(viewName)
  },
  sel: {
    getView:    sel.getView,        // getView(appState): string
  },
};
