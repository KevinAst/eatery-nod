import * as Redux                from 'redux';
import appState                  from '../state/appState';
import { createLogicMiddleware } from 'redux-logic';
import logic                     from '../logic';
//import api                     from '../../shared/api'; // L8TR

/**
 * Create our top-level redux appStore, WITH our registered redux-logic.
 *
 * NOTE: Our appStore is promoted as a 'creator' function, rather than
 *       a singleton pattern, to avoid the singleton anti-pattern.
 *       A singleton would:
 *        - make it harder to test
 *        - make it impossible to add server rendering of the app
 *          (which requires a separate store per request).
 *
 * @return {Redux Store} the top-levl redux appStore.
 */
export default function createAppStore() {
  
  // accumulate all our logic modules (redux-logic)
  const logicMiddleware = createLogicMiddleware(logic);
                                                // L8TR:
                                                // ? { // injected dependancies
                                                // ?   api
                                                // ? });

  // define our Redux app-wide store, WITH our middleware registration
  const appStore = Redux.createStore(appState, // our app-wide redux reducer
                                     Redux.compose(Redux.applyMiddleware(logicMiddleware))); // redux-logic middleware

  return appStore;
}
