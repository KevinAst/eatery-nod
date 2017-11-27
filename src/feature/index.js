import logActions  from './logActions';
import firebase    from './firebase';
import device      from './device';
import auth        from './auth';
import leftNav     from './leftNav';
import view        from './view';
import eateries    from './eateries';

/**
 * The **'eatery-nod'** application is composed from following **features**:
 *  - **'logActions'**: logs all dispatched actions and resulting state
 *  - **'firebase'**:   initializes the google firebase service
 *  - **'device'**:     initializes the device for use by the app, and promotes a **device api** abstraction
 *  - **'auth'**:       promotes complete user authentication
 *  - **'leftNav'**:    promotes the app-specific Drawer/SideBar on the app's left side
 *  - **'view'**:       maintains the currentView with get/set cross-feature communication bindings
 *  - **'eateries'**:   manages and promotes the eateries view
 */
export default [
  logActions,
  firebase,
  device,
  auth,
  leftNav,
  view,
  eateries,
];
