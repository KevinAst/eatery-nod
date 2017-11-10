import {openSideBar,
        closeSideBar}  from './comp/SideBar';

/**
 * The public API promoted by this feature through: app.leftNav...
 */
export default {
  api: {
    open:  openSideBar,  // open():  void ... open  the SideBar
    close: closeSideBar, // close(): void ... close the SideBar
  },
};
