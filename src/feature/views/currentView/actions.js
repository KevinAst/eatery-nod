import {generateActions} from 'action-u';
import featureName       from './featureName';

export default generateActions.root({
  [featureName]: { // prefix all actions with our feature name, guaranteeing they unique app-wide!

    changeView: {  // actions.changeView(viewName): Action
                   // > change the currentView to the supplied viewName.
                   actionMeta: {
                     traits: ['viewName'],
                   },
    },

  },
});
