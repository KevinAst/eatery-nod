import {generateActions} from 'action-u';

export default generateActions.root({
  profile: {

    changed: { // profile.changed(userProfile): Action
      // > user profile changed: userProfile: {name, pool}
      //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
      actionMeta: {
        traits: ['userProfile'],
      },
    },

  },
});
