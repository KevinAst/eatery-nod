import {generateActions} from 'action-u';
import signInFormMeta    from '../logic/iForms/signInFormMeta';

export default generateActions.root({
  auth: {

    bootstrap: {   // auth.bootstrap(): Action
                   // > bootstrap authorization process
                   //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
                   actionMeta: {},

      haveDeviceCredentials: {  // auth.bootstrap.haveDeviceCredentials(encodedCredentials): Action
                                // > credentials were stored on our device
                                //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
                                actionMeta: {
                                  traits: ['encodedCredentials'],
                                },
      },

      noDeviceCredentials: {  // auth.bootstrap.noDeviceCredentials(): Action
                              // > NO credentials were stored on our device
                              //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
                              actionMeta: {},
      },

      fail: { // auth.bootstrap.fail(err): Action
              // > local device storage access failed (fetching credentials) ... ?? not exactly catastrophic: should we just manually signIn?
              //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
              actionMeta: {
                traits: ['err'],
              },
      },
    },

    // inject the standard iForm auto-generated form actions
    // ... open(), fieldChanged(), fieldTouched(), process(), process.reject(), close()
    signIn: signInFormMeta.registrar.formActionGenesis({

      // along with additional app-specific actions:

                  // auth.signIn(email, pass): Action
                  // > SignIn with supplied email/pass
                  //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
                  actionMeta: {
                    traits: ['email', 'pass'],
                  },

      complete: { // auth.signIn.complete(??): Action ?? define params
                  // > signIn completed successfully
                  //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
                  actionMeta: {
                    // traits: ['hmmm'], ?? define params
                  },
      },

      fail: {     // auth.signIn.fail(err): Action
                  // > signIn failure
                  //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
                  actionMeta: {
                    traits: ['err'],
                  },
      },


    }),
  },
});
