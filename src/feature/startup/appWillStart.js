import React            from 'react';
import platformSetup    from './init/platformSetup';
import initFireBase     from './init/firebase/initFireBase';
import Notify           from '../../util/notify'; 

/**
 * An app-level life-cycle hook, initializing our feature by:
 *  - performing platform-specific setup (iOS/Android)
 *  - initializes FireBase
 *  - and initialize the notify utility, by injecting it in our App root
 */
export default function appWillStart(app, children) {
  // platform-specific setup (iOS/Android)
  platformSetup();

  // initialize FireBase
  initFireBase();

  // initialize notify utility, by injecting it in our App root
  return [React.Children.toArray(children), <Notify key="Notify"/>];
}
