import {createFeature}  from 'feature-u';
import initFireBase     from './init/initFireBase';

/**
 * The **'firebase'** feature initializes the google firebase service,
 * and provides a placeholder for future API abstractions.
 */
export default createFeature({
  name: 'firebase',

  appWillStart({fassets, curRootAppElm}) {
    initFireBase(); // initialize FireBase
  },
});
