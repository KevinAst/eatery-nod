import {generateActions}     from 'action-u';
import featureName           from './featureName';
import eateryFilterFormMeta  from './eateryFilterFormMeta';

export default generateActions.root({

  [featureName]: { // prefix all actions with our feature name, guaranteeing they unique app-wide!


    dbPool: {

      changed: { // actions.dbPool.changed(eateries): Action
                 // > eateries changed: eateries: { eateryKey1: {id, name, addr, phone, loc, navUrl, website}, eateryKey2: {...}}
                 actionMeta: {
                   traits: ['eateries'],
                 },
      },


      add: { // actions.dbPool.add(eateryId): Action
             // > add eatery (from eateryId) to pool
             actionMeta: {
               traits: ['eateryId'],
             },
      
        eateryDetail: { // actions.dbPool.add.eateryDetail(eatery): Action
                        // > add supplied eatery to our pool
                        actionMeta: {
                          traits: ['eatery'],
                        },
      
          fail: { // actions.dbPool.add.eateryDetail.fail(eateryId, err): Action
                  // > in process of adding eatery, detail retrieval failed
                  actionMeta: {
                    traits: ['eateryId', 'err'],
                  },
          },
        },
      
      },

      
      remove: { // actions.dbPool.remove(eateryId): Action
                // > remove eatery (from eateryId) to pool
                actionMeta: {
                  traits: ['eateryId'],
                },
      },

    },


    // inject the standard iForm auto-generated form actions
    // ... open(), fieldChanged(), fieldTouched(), process(), process.reject(), close()
    applyFilter: eateryFilterFormMeta.registrar.formActionGenesis({

      // along with additional app-specific actions:

                   // actions.applyFilter([filter]): Action
                   // > apply listView filter (either supplied or from state)
                   //   NOTE: logic supplements action with .entries[] and .filter (as needed)
                   actionMeta: {
                     traits: ['filter'],
                     ratify: (filter=null) => [filter]
                   },
    }),


    viewDetail: { // actions.viewDetail(eateryId): Action
                  // > view eatery details (from supplied eateryId)
                  actionMeta: {
                    traits: ['eateryId'],
                  },

      close: { // actions.viewDetail.close(): Action
               // > close eatery details
               actionMeta: {},
      },

    },


    spin: { // actions.spin(): Action
            // > randomly select a date night eatery
            actionMeta: {},

      complete: { // actions.spin.complete(eateryId): Action
                  // > spin complete, with supplied eateryId selected
                  actionMeta: {
                    traits: ['eateryId'],
                  },
      },

    },


  },
});