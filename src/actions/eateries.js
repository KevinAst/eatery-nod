import {generateActions}     from 'action-u';
import eateryFilterFormMeta  from '../logic/iForms/eateryFilterFormMeta';

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


      add: { // eateries.dbPool.add(eateryId): Action
             // > add eatery (from eateryId) to pool
             //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
             actionMeta: {
               traits: ['eateryId'],
             },
      
        eateryDetail: { // eateries.dbPool.add.eateryDetail(eatery): Action
                        // > add supplied eatery to our pool
                        //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
                        actionMeta: {
                          traits: ['eatery'],
                        },
      
          fail: { // eateries.dbPool.add.eateryDetail.fail(eateryId, err): Action
                  // > in process of adding eatery, detail retrieval failed
                  //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
                  actionMeta: {
                    traits: ['eateryId', 'err'],
                  },
          },
        },
      
      },
      
      remove: { // eateries.dbPool.remove(eateryId): Action
                // > remove eatery (from eateryId) to pool
                //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
                actionMeta: {
                  traits: ['eateryId'],
                },
      },

    },

    // inject the standard iForm auto-generated form actions
    // ... open(), fieldChanged(), fieldTouched(), process(), process.reject(), close()
    applyFilter: eateryFilterFormMeta.registrar.formActionGenesis({

      // along with additional app-specific actions:

                   // eateries.applyFilter([filter]): Action
                   // > apply listView filter (either supplied or from state)
                   //   NOTE: logic supplements action with .entries[] and .filter (as needed)
                   //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
                   actionMeta: {
                     traits: ['filter'],
                     ratify: (filter=null) => [filter]
                   },
    }),

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
