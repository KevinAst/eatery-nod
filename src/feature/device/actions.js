import {generateActions} from 'action-u';
import featureName       from './featureName';

export default generateActions.root({
  [featureName]: { // prefix all actions with our feature name, guaranteeing they unique app-wide!

    bootstrap: {   // actions.bootstrap(): Action
                   // > bootstrap system resources
                   actionMeta: {},
    },

    loadFonts: {   // actions.loadFonts(): Action
                   // > load fonts needed by system/app
                   actionMeta: {},
      complete: {  // actions.loadFonts.complete(): Action
                   // > system fonts are now available
                   actionMeta: {},
      },
      fail: {      // actions.loadFonts(err): Action
                   // > system fonts are NOT available - app CANNOT start
                   actionMeta: {
                     traits: ['err'],
                   },
      },
    },

    locateDevice: { // actions.locateDevice(): Action
                    // > determing geo location of device
                    actionMeta: {},
      complete: {   // actions.locateDevice.complete(loc): Action
                    // > device location is now available
                    actionMeta: {
                      traits: ['loc'],
                    },
      },            
      fail: {       // actions.locateDevice(err): Action
                    // > device location failed - fallback to last known location
                    actionMeta: {
                      traits: ['err'],
                    },
      },
    },

    statusUpdate: { // actions.statusUpdate(statusMsg): Action
                    // > system status has been updated to supplied statusMsg
                    actionMeta: {
                      traits: ['statusMsg'],
                    },
    },

    ready: {   // actions.ready(): Action
               // > device is ready for app to use
               actionMeta: {},
    },
  },
});
