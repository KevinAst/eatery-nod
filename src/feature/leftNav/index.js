import React            from 'react';
import {createFeature}  from '../../util/feature-u';
import {Drawer}         from 'native-base';
import SideBar, 
      {registerDrawer,
       openSideBar,
       closeSideBar}    from './comp/SideBar';

/**
 * The 'leftNav' feature introduces the app-specific Drawer/SideBar 
 * on the left-hand side of the screen.
 *
 * For this feature's public API, please see publicAPI (below), 
 * promoted through app.leftNav.
 */
export default createFeature({

  name: 'leftNav',

  publicAPI: {
    open:  openSideBar,  // API: app.leftNav.open()
    close: closeSideBar, // API: app.leftNav.close()
  },

  appWillStart(app, children) {
    // inject our Drawer/SideBar at the app-level top
    return (
      <Drawer ref={ ref => registerDrawer(ref) }
              content={<SideBar/>}
              onClose={closeSideBar}>
        {children}
      </Drawer>
    );
  },

});
