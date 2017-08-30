import {applyMiddleware,
        compose,
        createStore}           from 'redux';
import {createLogicMiddleware} from 'redux-logic';
import appState                from '../../appState';
import logic                   from '../../logic';
import api                     from '../../api';

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
  const logicMiddleware = createLogicMiddleware(logic,
                                                { // injected dependancies
                                                  api,
                                                });

  // define our Redux app-wide store, WITH our middleware registration
  const appStore = createStore(appState, // our app-wide redux reducer
                               compose(applyMiddleware(logicMiddleware))); // redux-logic middleware

  // AS NEEDED: provide additional redux-logic diagnostics
  // logicMiddleware.monitor$.subscribe( probe => console.log('Diag(redux-logic diag): ', probe) );

  return appStore;
}
