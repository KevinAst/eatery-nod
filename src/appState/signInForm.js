import {reducerHash}  from 'astx-redux-util';
import actions        from '../actions';

export default reducerHash({

  // initiate interactive SignIn form
  // ... populate with optional email/pass/msg
  //     (supplied on failed signIn() attempt from device credentials)
  [actions.auth.interactiveSignIn]: (state, action) => ({
    email: action.email,
    pass:  action.pass,
    err: {
      formMsg: action.msg,
    },
  }),

  // ?? something to close form:
  "???.close.or.signInComplete.or.something": (state, action) => null,

  // ?? more to update form fields

}, null); // initialState




// ??? INITIAL ATTEMPT, but I think we maintain atomic fields at the parent level (see above)
// ? 
// ? import {combineReducers}    from 'redux';
// ? import {conditionalReducer,
// ?         joinReducers,
// ?         reducerHash}        from 'astx-redux-util';
// ? import actions              from '../actions';
// ? import x                    from '../appReducer/x'; // ??
// ? import y                    from '../appReducer/y'; // ??
// ? 
// ? export default joinReducers(
// ?   // FIRST: determine content shape (i.e. {} or null)
// ?   reducerHash({
// ? 
// ?     // initiate interactive SignIn form
// ?     [actions.auth.interactiveSignIn]: (state, action) => ({
// ?       // ... populate with optional email/pass/msg (supplied on failed signIn() attempt from device credentials)
// ?       email: action.email,
// ?       pass:  action.pass,
// ?       err: {
// ?         msg: action.msg,
// ?       },
// ?     }),
// ?     
// ?     // ??? TODO: something to close form:
// ?     "???.close.or.signInComplete.or.something": (state, action) => null
// ?   }),
// ? 
// ?   conditionalReducer(
// ?     // SECOND: maintain individual signInForm fields
// ?     //         ONLY when signInForm has content (i.e. is being edited)
// ?     (signInForm, action, originalReducerState) => signInForm !== null,
// ?     combineReducers({
// ?       x,
// ?       y
// ?     })),
// ? 
// ?   null); // initialState
