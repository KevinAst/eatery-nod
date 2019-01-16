import authService      from './authService';
import deviceService    from './deviceService';
import discoveryService from './discoveryService';
import eateryService    from './eateryService';
import firebaseInit     from './firebaseInit';

/**
 * The **services** directory is a categorized collection of **"Service Related"**
 * features _(some of which are "mockable")_:
 *  - **authService**:       a persistent authentication service (retaining active user)
 *  - **deviceService**:     promotes several device related services
 *  - **discoveryService**:  retrieves restaurant information from a geographical data source, emitting Discovery/Eatery objects
 *  - **eateryService**:     a persistent "Eateries" DB service, monitoring real-time Eatery DB activity
 *  - **firebaseInit**:      initialize the eatery-nod firebase DB
 */
export default [
  ...authService,
  deviceService,
  ...discoveryService,
  ...eateryService,
  firebaseInit,
];
