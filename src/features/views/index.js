import eateries     from './eateries';
import discovery    from './discovery';
import leftNav      from './leftNav';
import currentView  from './currentView';

/**
 * The **views** directory is a collection of **"UI Related"**
 * features.
 *  - **eateries**:     the eateries view UI
 *  - **discovery**:    the discovery view UI
 *  - **leftNav**:      promotes the Drawer/SideBar on the app's left side
 *  - **currentView**:  maintains the currentView state with get/set cross-feature bindings
 */
export default [
  eateries,
  discovery,
  leftNav,
  currentView,
];
