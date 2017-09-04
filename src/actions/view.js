import {generateActions} from 'action-u';
import verify            from '../util/verify';

export default generateActions.root({
  view: {

    change: { // view.change(view): Action
              // > change the app view: 'eateries', 'discovery'
              //   INTENT: #byUser, #byLogic, #forLogic, #forReducer ??
              actionMeta: {
                traits: ['view'],
                ratify: (view) => {
                  const check = verify.prefix('Action view.change(view) parameter violation: ');
                  check(view,                 'view is required');
                  check(view==='eateries' || 
                        view==='discovery',   `invalid view: '${view}' ... expecting either 'eateries' or 'discovery'`);
                  return [view];
                },
              },
    },

  },
});
