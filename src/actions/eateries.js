import {generateActions} from 'action-u';

export default generateActions.root({
  eateries: {

    dbPool: {
      changed: { // eateries.dbPool.changed(eateries): Action
                 // > eateries changed: eateries: { eateryKey1: {id, name, addr, phone, loc, navUrl, website}, eateryKey2: {...}}
                 //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
                 actionMeta: {
                   traits: ['eateries'],
                 },
      },
    },

    applyFilter: { // eateries.applyFilter([filter]): Action
                   // > apply listView filter (either supplied or from state)
                   //   NOTE: logic supplements action with .entries[]
                   //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
                   actionMeta: {
                     traits: ['filter'],
                     ratify: (filter=null) => [filter]
                   },
    },

  },
});
