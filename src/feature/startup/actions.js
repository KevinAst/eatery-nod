import {generateActions} from 'action-u';
import featureName       from './featureName';

export default generateActions.root({
  [featureName]: { // prefix all actions with our feature name, guaranteeing they unique app-wide!

    bootstrap: {   // actions.bootstrap(): Action
                   // > bootstrap system resources
                   //   INTENT: #byLogic, #forLogic
                   actionMeta: {},
    },

    loadFonts: {   // actions.loadFonts(): Action
                   // > load fonts needed by system/app
                   //   INTENT: #byLogic, #forLogic
                   actionMeta: {},
      complete: {  // actions.loadFonts.complete(): Action
                   // > system fonts are now available
                   //   INTENT: #byLogic, #forLogic, #forReducer
                   actionMeta: {},
      },
      fail: {      // actions.loadFonts(err): Action
                   // > system fonts are NOT available - app CANNOT start
                   //   INTENT: #byLogic, #forLogic, #forReducer
                   actionMeta: {
                     traits: ['err'],
                   },
      },
    },

    locateDevice: { // actions.locateDevice(): Action
                    // > determing geo location of device
                    //   INTENT: #byLogic, #forLogic
                    actionMeta: {},
      complete: {   // actions.locateDevice.complete(loc): Action
                    // > device location is now available
                    //   INTENT: #byLogic, #forLogic, #forReducer
                    actionMeta: {
                      traits: ['loc'],
                    },
      },            
      fail: {       // actions.locateDevice(err): Action
                    // > device location failed - fallback to last known location
                    //   INTENT: #byLogic, #forLogic, #forReducer
                    actionMeta: {
                      traits: ['err'],
                    },
      },
    },

    statusUpdate: { // actions.statusUpdate(statusMsg): Action
                    // > system status has been updated to supplied statusMsg
                    //   INTENT: #byLogic, #forLogic
                    actionMeta: {
                      traits: ['statusMsg'],
                    },
    },
  },
});
