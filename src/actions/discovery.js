import {generateActions}        from 'action-u';
import discoveryFilterFormMeta  from '../logic/iForms/discoveryFilterFormMeta';

export default generateActions.root({
  discovery: {

    // inject the standard iForm auto-generated form actions
    // ... open(), fieldChanged(), fieldTouched(), process(), process.reject(), close()
    filter: discoveryFilterFormMeta.registrar.formActionGenesis(),

    retrieve: { // discovery.retrieve([filter]): Action
                // > retrieval of discovery eateries using supplied filter
                //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
                actionMeta: {
                  traits: ['filter']
                },

      complete: { // discovery.retrieve.complete(filter, eateriesResp): Action
                  // > discovery eateries retrieval complete, with supplied response
                  //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
                  actionMeta: {
                    traits: ['filter', 'eateriesResp'],
                  },
      },

      fail: { // discovery.retrieve.fail(err): Action
              // > discovery eateries retrieval failed, with supplied err
              //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
              actionMeta: {
                traits: ['err'],
              },
      },

    },

    nextPage: { // discovery.nextPage(pagetoken): Action
                // > retrieve next-page, via supplied pagetoken
                //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
                actionMeta: {
                  traits: ['pagetoken'],
                },

      complete: { // discovery.nextPage.complete(eateriesResp): Action
                  // > discovery eateries nextPage retrieval complete, with supplied response
                  //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
                  actionMeta: {
                    traits: ['eateriesResp'],
                  },
      },

      fail: { // discovery.nextPage.fail(err): Action
              // > discovery eateries nextPage retrieval failed, with supplied err
              //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
              actionMeta: {
                traits: ['err'],
              },
      },

    },

  },
});
