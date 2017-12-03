import React            from 'react';
import {Drawer}         from 'native-base';
import SideBar, 
      {registerDrawer,
       closeSideBar}    from './comp/SideBar';

/**
 * An app-level life-cycle hook that:
 *  - injects our Drawer/SideBar at the top of our app.
 */
export default function appWillStart(app, children) {
  return (
    <Drawer ref={ ref => registerDrawer(ref) }
            content={<SideBar/>}
            onClose={closeSideBar}>
      {children}
    </Drawer>
  );
}
