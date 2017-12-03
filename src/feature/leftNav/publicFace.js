import {openSideBar,
        closeSideBar}  from './comp/SideBar';

/**
 * The publicFace promoted by this feature through: app.leftNav...
 */
export default {
  open:  openSideBar,  // open():  void ... open  the SideBar
  close: closeSideBar, // close(): void ... close the SideBar
};
