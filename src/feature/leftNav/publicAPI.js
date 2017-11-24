import {openSideBar,
        closeSideBar}  from './comp/SideBar';

/**
 * The public API promoted by this feature through: app.leftNav...
 */
export default {
  open:  openSideBar,  // open():  void ... open  the SideBar
  close: closeSideBar, // close(): void ... close the SideBar // ??? this may NOT be needed
};
