import actions      from './actions';
import * as sel     from './state';
import featureName  from './featureName';

/**
 * The Public Face promoted by this feature.
 */
export default {
  define: {
    [`${featureName}.actions.changeView`]: actions.changeView, // changeView(viewName)

    [`${featureName}.sel.getView`]: sel.getView, // getView(appState): string
  },
};
