import {generateActions} from 'action-u';

export default generateActions.root({
  system: {
    bootstrap: {   // system.bootstrap(): Action
                   // > bootstrap system resources
                   //   INTENT: #byLogic, #forLogic
                   actionMeta: {},

      loadFonts: {   // system.bootstrap.loadFonts(): Action
                     // > load fonts needed by system/app
                     //   INTENT: #byLogic, #forLogic
                     actionMeta: {},
        complete: {  // system.bootstrap.loadFonts.complete(): Action
                     // > system fonts are now available
                     //   INTENT: #byLogic, #forLogic, #forReducer
                     actionMeta: {},
        },
        fail: {      // system.bootstrap.loadFonts(err): Action
                     // > system fonts are NOT available - app CANNOT start
                     //   INTENT: #byLogic, #forLogic, #forReducer
                     actionMeta: {
                       traits: ['err'],
                     },
        },
      },

      locateDevice: { // system.bootstrap.locateDevice(): Action
                      // > determing geo location of device
                      //   INTENT: #byLogic, #forLogic
                      actionMeta: {},
        complete: {   // system.bootstrap.locateDevice.complete(loc): Action
                      // > device location is now available
                      //   INTENT: #byLogic, #forLogic, #forReducer
                      actionMeta: {
                        traits: ['loc'],
                      },
        },            
        fail: {       // system.bootstrap.locateDevice(err): Action
                      // > device location failed - fallback to last known location
                      //   INTENT: #byLogic, #forLogic, #forReducer
                      actionMeta: {
                        traits: ['err'],
                      },
        },
      },

      statusUpdate: { // system.bootstrap.statusUpdate(statusMsg): Action
                      // > system status has been updated to supplied statusMsg
                      //   INTENT: #byLogic, #forLogic
                      actionMeta: {
                        traits: ['statusMsg'],
                      },
      },
    },
  },
});
