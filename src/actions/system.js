import {generateActions} from 'action-u';

export default system = generateActions.root({
  system: {
    bootstrap: {   // system.bootstrap(): Action
                   // > bootstrap system resources
                   //   INTENT: #byLogic, #forLogic
                   actionMeta: {},
      complete: {  // system.bootstrap.complete(): Action
                   // > system resourses available - app CAN start
                   //   INTENT: #byLogic, #forLogic, #forReducer
                   actionMeta: {},
      },
      fail: {      // system.bootstrap.fail(err): Action
                   // > system resourses are NOT available - app CANNOT start
                   //   INTENT: #byLogic, #forLogic, #forReducer
                   actionMeta: {
                     traits: ['err']
                   },
      },
    },
  },
});
