import {createLogic}  from 'redux-logic';
import actions        from '../actions';

export const retrieve = createLogic({

  name: 'discovery.retrieve',
  type: String(actions.discovery.retrieve),

  process({getState, action, api}, dispatch, done) {

    api.discovery.searchEateries(action.filter)
       .then(resp => {
         // console.log(`xx here is our response: `, resp);
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

export const nextPage = createLogic({

  name: 'discovery.nextPage',
  type: String(actions.discovery.nextPage),

  process({getState, action, api}, dispatch, done) {

    api.discovery.searchEateriesNextPage(action.pagetoken)
       .then(resp => {
         // console.log(`xx here is our response: `, resp);
         dispatch( actions.discovery.nextPage.complete(resp) );
         done();
       })
       .catch(err => {
         console.log(`*** ERROR *** googlePlacesAPI nearBySearch ... ${''+err}`);
         dispatch( actions.discovery.nextPage.fail(err) );
         done();
       });
  },

});


// promote all logic (accumulated in index.js)
// ... named exports (above) are used by unit tests :-)
export default [
  retrieve,
  nextPage,
];
