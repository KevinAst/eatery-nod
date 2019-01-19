import leftNav      from './leftNav';
import currentView  from './currentView';
import eateries     from './eateries';
import discovery    from './discovery';

/**
 * The **views** directory is a categorized collection of **"UI Related"**
 * features.
 *  - **leftNav**:      promotes the Drawer/SideBar on the app's left side
 *  - **currentView**:  maintains the currentView with get/set cross-feature communication bindings
 *  - **eateries**:     the eateries view UI
 *  - **discovery**:    the discovery view UI
 */
export default [
  leftNav,
  currentView,
  eateries,
  discovery,
];
