import {generateActions} from 'action-u';
import featureName       from './featureName';

export default generateActions.root({
  [featureName]: { // prefix all actions with our feature name, guaranteeing they unique app-wide!

    kickStart: { // actions.kickStart(): Action
                 // > kickStart device initialization process
                 actionMeta: {},
    },

    guiIsReady: { // actions.guiIsReady(): Action
                  // > the full GUI can now be used (i.e. react-native components is now fully initialized)
                  actionMeta: {},
    },

    setLoc: { // actions.setLoc(loc): Action
              // > set device GPS location
              actionMeta: {
                traits: ['loc'],
              },
    },            

    setStatus: { // actions.setStatus(statusMsg): Action
                 // > set device status (e.g. 'Waiting for bla bla bla' -or- 'READY'
                 actionMeta: {
                   traits: ['statusMsg'],
                 },
    },

    // the fundamental action that communicates our device is "fully initialized" and "ready for action"
    // ... monitored by down-stream features (e.g. authorization),
    // ... logically starting our app running!
    ready: { // actions.ready(): Action
             // > device is ready for app to use
             actionMeta: {},
    },
  },
});
