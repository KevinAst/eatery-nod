import {generateActions} from 'action-u';

export default generateActions.root({
  discovery: {

    retrieve: { // discovery.retrieve([filter]): Action
                // > retrieval of discovery eateries using supplied filter (??either supplied or from state)
                //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
                actionMeta: {
                  traits: ['filter'],
                  ratify: (filter=null) => [filter]
                },

      complete: { // discovery.retrieve.complete(eateriesResp): Action
                  // > discovery eateries retrieval complete, with supplied response
                  //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
                  actionMeta: {
                    traits: ['eateriesResp'],
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
  },
});
