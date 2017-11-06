import {openSideBar,
        closeSideBar}  from './comp/SideBar';

/**
 * The 'leftNav' feature public API, promoted through app.leftNav.api
 */
export default {
  api: {
    open:  openSideBar,  // API: app.leftNav.api.open()
    close: closeSideBar, // API: app.leftNav.api.close()
  },
};
