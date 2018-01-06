import {generateActions}        from 'action-u';
import featureName              from './featureName';
import discoveryFilterFormMeta  from './discoveryFilterFormMeta';

export default generateActions.root({

  [featureName]: { // prefix all actions with our feature name, guaranteeing they unique app-wide!

    // inject the standard iForm auto-generated form actions
    // ... open(), fieldChanged(), fieldTouched(), process(), process.reject(), close()
    filterForm: discoveryFilterFormMeta.registrar.formActionGenesis(),

    retrieve: { // actions.retrieve([filter]): Action
                // > retrieval of discovery eateries using supplied filter
                actionMeta: {
                  traits: ['filter']
                },

      complete: { // actions.retrieve.complete(filter, eateriesResp): Action
                  // > discovery eateries retrieval complete, with supplied response
                  actionMeta: {
                    traits: ['filter', 'eateriesResp'],
                  },
      },

      fail: { // actions.retrieve.fail(err): Action
              // > discovery eateries retrieval failed, with supplied err
              actionMeta: {
                traits: ['err'],
              },
      },

    },

    nextPage: { // actions.nextPage(pagetoken): Action
                // > retrieve next-page, via supplied pagetoken
                actionMeta: {
                  traits: ['pagetoken'],
                },

      complete: { // actions.nextPage.complete(eateriesResp): Action
                  // > discovery eateries nextPage retrieval complete, with supplied response
                  actionMeta: {
                    traits: ['eateriesResp'],
                  },
      },

      fail: { // actions.nextPage.fail(err): Action
              // > discovery eateries nextPage retrieval failed, with supplied err
              actionMeta: {
                traits: ['err'],
              },
      },

    },

  },
});
