import {createFeature}       from 'feature-u';
import featureName           from './featureName';
import {isFassetBootstrapFn} from './bootstrapFn';
import actions               from './actions';
import logic                 from './logic';
import route                 from './route';
import reducer               from './state';

// feature: bootstrap
//          initialize the app through a critical-path app initialization
//          process that must complete before the app can run, using the
//          `'bootstrap.*'` fassets use contract (full details in README)
export default createFeature({
  name: featureName,

  reducer,
  logic,
  route,

  // our public face ...
  fassets: {

    // the 'bootstrap.*' use contract (see 'bootstrap' logic module)
    use: [
      ['bootstrap.*', {required: false, type: isFassetBootstrapFn}],
    ],


    // various public "push" resources
    define: {

      // *** public actions ***
                                   // the fundamental action, 
                                   // monitored by down-stream features (e.g. authorization),
                                   // logically starting our app running!
      'actions.bootstrapComplete': actions.complete,

    }
  },

  appDidStart({fassets, appState, dispatch}) {
    // dispatch our base bootstrap action, that "kicks off" the app's bootstrap initialization process
    dispatch( actions() ); // ... this base "actions" is the bootstrap action
  }

});
