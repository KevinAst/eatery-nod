import {generateActions} from 'action-u';

export default generateActions({
  startup: {       // startup(): Action
                   // > bootstrap system resources
                   //   INTENT: #byLogic, #forLogic
                   actionMeta: {},

    loadFonts: {   // startup.loadFonts(): Action
                   // > load fonts needed by system/app
                   //   INTENT: #byLogic, #forLogic
                   actionMeta: {},
      complete: {  // startup.loadFonts.complete(): Action
                   // > system fonts are now available
                   //   INTENT: #byLogic, #forLogic, #forReducer
                   actionMeta: {},
      },
      fail: {      // startup.loadFonts(err): Action
                   // > system fonts are NOT available - app CANNOT start
                   //   INTENT: #byLogic, #forLogic, #forReducer
                   actionMeta: {
                     traits: ['err'],
                   },
      },
    },

    locateDevice: { // startup.locateDevice(): Action
                    // > determing geo location of device
                    //   INTENT: #byLogic, #forLogic
                    actionMeta: {},
      complete: {   // startup.locateDevice.complete(loc): Action
                    // > device location is now available
                    //   INTENT: #byLogic, #forLogic, #forReducer
                    actionMeta: {
                      traits: ['loc'],
                    },
      },            
      fail: {       // startup.locateDevice(err): Action
                    // > device location failed - fallback to last known location
                    //   INTENT: #byLogic, #forLogic, #forReducer
                    actionMeta: {
                      traits: ['err'],
                    },
      },
    },

    statusUpdate: { // startup.statusUpdate(statusMsg): Action
                    // > system status has been updated to supplied statusMsg
                    //   INTENT: #byLogic, #forLogic
                    actionMeta: {
                      traits: ['statusMsg'],
                    },
    },
  },
});
