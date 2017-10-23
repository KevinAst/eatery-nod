import {shapedReducer}  from '../../common/util/feature-u';
import reducer          from './reducer';

/**
 * The miniMeta object internally promotes critical Feature
 * meta data, EVEN DURING IN-LINE EXPANSION!!!
 *
 * It is OUR convention to define a "single source of truth" for a
 * small amount of critical data.
 * 
 * By defining miniMeta in it's own seperate module, IT CAN be
 * expanded (AND USED) independently from the Feature object expansion
 * (defined in index.js), allowing it to be referenced during in-line
 * expansion throughout our code.
 */
export default {
  name:    'startup',
  reducer: shapedReducer(reducer, 'device'),
  getFeatureState(appState) {
    // NOTE: If you don't want to reference "this",
    //       making the function usable outside of this object,
    //       simply pull name/reducer out in it's own vars
    //       and reference them via closures
    return this.reducer.getShapedState(appState);
  },
};
