import {generateActions} from 'action-u';
import featureName       from './featureName';
import signInFormMeta    from './signInFormMeta';

export default generateActions.root({
  [featureName]: { // prefix all actions with our feature name, guaranteeing they unique app-wide!

    bootstrap: {   // actions.bootstrap(): Action
                   // > bootstrap our authorization process
                   actionMeta: {},

      haveDeviceCredentials: {  // actions.bootstrap.haveDeviceCredentials(encodedCredentials): Action
                                // > credentials were stored on our device
                                actionMeta: {
                                  traits: ['encodedCredentials'],
                                },
      },

      noDeviceCredentials: {  // actions.bootstrap.noDeviceCredentials(): Action
                              // > NO credentials were stored on our device
                              actionMeta: {},
      },

      fail: { // actions.bootstrap.fail(err): Action
              // > local device storage access failed (fetching credentials) ... ?? not exactly catastrophic: should we just manually signIn?
              actionMeta: {
                traits: ['err'],
              },
      },
    },

    // inject the standard iForm auto-generated form actions
    // ... open(), fieldChanged(), fieldTouched(), process(), process.reject(), close()
    signIn: signInFormMeta.registrar.formActionGenesis({
    
      // along with additional app-specific actions:
    
                  // actions.signIn(email, pass): Action
                  // > SignIn with supplied email/pass
                  actionMeta: {
                    traits: ['email', 'pass'],
                  },
    
      complete: { // actions.signIn.complete(user): Action
                  // > signIn completed successfully
                  //   NOTE: logic supplements action with userProfile
                  actionMeta: {
                    traits: ['user'],
                  },
      },
    
      checkEmailVerified: { // actions.signIn.checkEmailVerified(): Action
                            // > check to see if account email has been verified
                            actionMeta: {},
      },
    
      resendEmailVerification: { // actions.signIn.resendEmailVerification(): Action
                                 // > resend email verificaion
                                 //   NOTE: logic supplements action with most up-to-date user
                                 actionMeta: {},
      },
    
    }),

    signOut: { // actions.signOut(): Action
               // > sign out active user
               actionMeta: {},
    },

    userProfileChanged: { // actions.userProfileChanged(userProfile): Action
                          // > user profile changed: userProfile: {name, pool}
                          actionMeta: {
                            traits: ['userProfile'],
                          },
    },

  },
});
