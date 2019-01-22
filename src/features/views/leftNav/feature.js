import React                from 'react';
import {Drawer}             from 'native-base';
import {createFeature,
        fassetValidations}  from 'feature-u';
import SideBar, 
       {registerDrawer,
        openSideBar,
        closeSideBar}       from './comp/SideBar';

const featureName = 'leftNav';

// feature: leftNav
//          promote the app-specific Drawer/SideBar on the app's left
//          side.  This feature is app-neutral, as it pulls in it's
//          menu items from external features using the
//          'leftNavItem.*' use contract (full details in README)
export default createFeature({
  name: featureName,

  // our public face ...
  fassets: {
    define: {
      [`${featureName}.open`]:  openSideBar,  // open():  void ... open  the SideBar
      [`${featureName}.close`]: closeSideBar, // close(): void ... close the SideBar
    },
    use: [
      ['leftNavItem.*', {required: true, type: fassetValidations.comp}], // expecting: <ListItem/>
    ],
  },

  // inject our Drawer/SideBar component at the root of our app
  appWillStart({fassets, curRootAppElm}) {
    return (
      <Drawer ref={ ref => registerDrawer(ref) }
              content={<SideBar/>}
              onClose={closeSideBar}>
        {curRootAppElm}
      </Drawer>
    );
  }

});
