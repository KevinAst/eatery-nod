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

    viewDetail: { // eateries.viewDetail(eateryId): Action
                  // > view eatery details (from supplied eateryId)
                  //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
                  actionMeta: {
                    traits: ['eateryId'],
                  },

      close: { // eateries.viewDetail.close(): Action
               // > close eatery details
               //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
               actionMeta: {},
      },

    },

    spin: { // eateries.spin(): Action
            // > randomly select a date night eatery
            //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
            actionMeta: {},

      complete: { // eateries.spin.complete(eateryId): Action
                  // > spin complete, with supplied eateryId selected
                  //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
                  actionMeta: {
                    traits: ['eateryId'],
                  },
      },

    },

  },
});
