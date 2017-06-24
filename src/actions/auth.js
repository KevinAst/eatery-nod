import {generateActions} from 'action-u';

export default auth = generateActions.root({
  auth: {
    bootstrap: {   // auth.bootstrap(): Action
                   // ... bootstrap authorization process
                   //     INTENT: #byUser, #byLogic, #forReducer, #forLogic ??pick
                   actionMeta: {},
      // ??? MORE HERE (following NOT used, just boiler plate)
      complete: {  // auth.bootstrap.complete(): Action
                   // ... auth resourses available for our app to start
                   //     INTENT: #byUser, #byLogic, #forReducer, #forLogic ??pick
                   actionMeta: {},
      },
      fail: {      // auth.bootstrap.fail(err): Action
                   // ... auth resourses are NOT available (app cannot start)
                   //     INTENT: #byUser, #byLogic, #forReducer, #forLogic ??pick
                   actionMeta: {
                     traits: ['err']
                   },
      },
    },
  },
});
