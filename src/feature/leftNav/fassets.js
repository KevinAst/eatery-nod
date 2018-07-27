import {openSideBar,
        closeSideBar}        from './comp/SideBar';
import featureName           from './featureName';
import {fassetValidations }  from 'feature-u';

/**
 * The Public Face promoted by this feature.
 */
export default {
  define: {
    [`${featureName}.open`]:  openSideBar,  // open():  void ... open  the SideBar
    [`${featureName}.close`]: closeSideBar, // close(): void ... close the SideBar
  },
  use: [
    ['leftNavItem.*', {required: false, type: fassetValidations.comp}], // expecting: <ListItem/>
  ],
};
