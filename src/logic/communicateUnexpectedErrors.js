import {createLogic}         from 'redux-logic';
import handleUnexpectedError from '../util/handleUnexpectedError';

/**
 * Monitor unexpected conditions within the redux dispatch process
 * (where most of our app logic resides) ...
 *    - communicating problem to the user
 *    - and logging the details (for tech support)
 */
export default createLogic({

  name: 'communicateUnexpectedErrors',
  type: [/\.fail$/,                // ... from app async '*.fail' actions
         'UNHANDLED_LOGIC_ERROR'], // ... from redux-logic error handler
  
  process({getState, action}, dispatch, done) {

    const err = action.err ||   // ... from app async '*.fail' actions
                action.payload; // ... from redux-logic error handler

    dispatch( handleUnexpectedError(err) );
    done();
  },

});
