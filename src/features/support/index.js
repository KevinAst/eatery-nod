import bootstrap  from './bootstrap';
import firebaseInit     from './firebaseInit';

/**
 * The **support** directory is a categorized collection of
 * **"Support Utility"** features.
 * 
 *  - **bootstrap**:     critical-path app initialization through the `'bootstrap.*'` fassets use contract
 *  - **firebaseInit**:  promote a utility function to initialize the eatery-nod firebase DB
 */
export default [
  bootstrap,
  firebaseInit,
];
