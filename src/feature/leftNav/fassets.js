import {openSideBar,
        closeSideBar}  from './comp/SideBar';

/**
 * The Public Face promoted by this feature.
 */
export default {
  define: {
    'leftNav.open':  openSideBar,  // open():  void ... open  the SideBar
    'leftNav.close': closeSideBar, // close(): void ... close the SideBar
  }
};
