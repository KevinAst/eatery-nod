import {generateActions} from 'action-u';

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

    signIn: { // auth.signIn(email, pass): Action
              // > SignIn with supplied email/pass
              //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
              actionMeta: {
                traits: ['email', 'pass'],
              },
      // ?? more sub-actions ... success/fail
    },

    interactiveSignIn: { // auth.interactiveSignIn(email='', pass='', formMsg=''): Action
                         // > initiate interactive SignIn form.
                         //   NOTE: email/pass/formMsg optionally supplied on failed signIn() attempt from device credentials
                         //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
                         actionMeta: {
                           traits: ['email', 'pass', 'formMsg'],
                           ratify: (email='', pass='', formMsg='') => [email, pass, formMsg],
                         },
      // ?? more sub-actions ... success/fail
    },
  },
});
