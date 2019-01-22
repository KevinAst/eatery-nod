import {createFeature}  from 'feature-u';
import featureName      from './featureName';
import actions          from './actions';
import reducer          from './state';
import * as sel         from './state';

// feature: currentView
//          maintain the currentView as a string (full details in README)
export default createFeature({
  name: featureName,

  // our public face ...
  fassets: {
    define: {
      [`${featureName}.actions.changeView`]: actions.changeView, // changeView(viewName)

      [`${featureName}.sel.getView`]: sel.getView, // getView(appState): string
    },
  },

  reducer,
});
