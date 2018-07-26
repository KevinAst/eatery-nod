import React            from 'react';
import {Drawer}         from 'native-base';
import SideBar, 
      {registerDrawer,
       closeSideBar}    from './comp/SideBar';

/**
 * Inject our Drawer/SideBar component at the root of our app
 */
export default function appWillStart({fassets, curRootAppElm}) {
  return (
    <Drawer ref={ ref => registerDrawer(ref) }
            content={<SideBar/>}
            onClose={closeSideBar}>
      {curRootAppElm}
    </Drawer>
  );
}
