import {generateActions} from 'action-u';

export default system = generateActions.root({
  system: {
    bootstrap: {   // system.bootstrap(): Action
                   // ... bootstrap system resources
                   //     INTENT: #byUser, #byLogic, #forReducer, #forLogic ??pick
                   actionMeta: {},
      complete: {  // system.bootstrap.complete(): Action
                   // ... system resourses available for our app to start
                   //     INTENT: #byUser, #byLogic, #forReducer, #forLogic ??pick
                   actionMeta: {},
      },
      fail: {      // system.bootstrap.fail(err): Action
                   // ... system resourses are NOT available (app cannot start)
                   //     INTENT: #byUser, #byLogic, #forReducer, #forLogic ??pick
                   actionMeta: {
                     traits: ['err']
                   },
      },
    },
  },
});
