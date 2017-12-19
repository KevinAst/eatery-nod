import {reducerHash}      from 'astx-redux-util';
import {slicedReducer}    from '../../util/feature-u';
import featureName        from './featureName';
import actions            from './actions';

// ***
// *** Our feature reducer, managing our currentView state.
// ***

const reducer = slicedReducer(`view.${featureName}`, reducerHash({
  [actions.changeView]: (state, action) => action.viewName,
}, 'uninitialized') ); // initialState

export default reducer;


// ***
// *** Various Selectors
// ***

                        // NOTE: in this case, our feature state root IS our currentView (very simple)!
                        //       ... we use slicedReducer as a single-source-of-truth
export const getView  = (appState) => reducer.getSlicedState(appState);
