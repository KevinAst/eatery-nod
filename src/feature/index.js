import logActions  from './logActions';
import firebase    from './firebase';
import device      from './device';
import auth        from './auth';
import leftNav     from './leftNav';
import view        from './view';
import eateries    from './eateries';

/**
 * The **'eatery-nod'** application is composed from following features:
 *   - **'logActions'** feature: logs all dispatched actions and resulting state
 *   - **'firebase'**   feature: initializes the google firebase service
 *   - **'device'**     feature: initializes the device for use by the app
 *   - **'auth'**       feature: promotes complete user authentication
 *   - **'leftNav'**    feature: promotes the app-specific Drawer/SideBar on the app's left side
 *   - **'view'**       feature: maintains the currentView with get/set cross-feature communication bindings
 *   - **'eateries'**   feature: manages and promotes the eateries view
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
