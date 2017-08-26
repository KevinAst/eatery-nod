import {generateActions} from 'action-u';

export default generateActions.root({
  eateries: {

    changed: { // eateries.changed(eateries): Action
      // > eateries changed: eateries: { eateryKey1: {id, name, addr, phone, loc, navUrl, website}, eateryKey2: {...}}
      //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
      actionMeta: {
        traits: ['eateries'],
      },
    },

  },
});
