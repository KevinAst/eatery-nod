import {createLogic}  from 'redux-logic';
import actions        from '../actions';

export const retrieve = createLogic({

  name: 'discovery.retrieve',
  type: String(actions.discovery.retrieve),

  process({getState, action, api}, dispatch, done) {

    api.discovery.searchEateries(action.filter)
       .then(resp => {
         console.log(`??? here is our response: `, resp);
         dispatch( actions.discovery.retrieve.complete(resp) );
         done();
       })
       .catch(err => {
         console.log(`*** ERROR *** googlePlacesAPI nearBySearch ... ${''+err}`);
         dispatch( actions.discovery.retrieve.fail(err) );
         done();
       });
  },

});


// promote all logic (accumulated in index.js)
// ... named exports (above) are used by unit tests :-)
export default [
  retrieve,
];
