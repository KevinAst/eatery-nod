import {openSideBar,
        closeSideBar}  from './comp/SideBar';
import featureName     from './featureName';

/**
 * The Public Face promoted by this feature.
 */
export default {
  define: {
    [`${featureName}.open`]:  openSideBar,  // open():  void ... open  the SideBar
    [`${featureName}.close`]: closeSideBar, // close(): void ... close the SideBar
  }
};
