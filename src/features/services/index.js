import deviceService    from './deviceService';
import authService      from './authService';
import eateryService    from './eateryService';
import discoveryService from './discoveryService';

/**
 * The **services** directory is a categorized collection of **"Service Related"**
 * features _(that are "mockable")_:
 *  - **deviceService**:     promotes several device related services
 *  - **authService**:       a persistent authentication service (retaining active user)
 *  - **eateryService**:     a persistent "Eateries" DB service, monitoring real-time Eatery DB activity
 *  - **discoveryService**:  retrieves restaurant information from a geographical data source, emitting Discovery/Eatery objects
 */
export default [
  deviceService,
  ...authService,
  ...eateryService,
  ...discoveryService,
];
