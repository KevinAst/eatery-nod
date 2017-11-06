import React            from 'react';
import platformSetup    from './init/platformSetup';
import initFireBase     from './init/firebase/initFireBase';
import Notify           from '../../util/notify'; 

/**
 * An app-level life-cycle callback (supporting this 'startup'
 * feature), that initializes our feature, and injects the notify
 * utility at the top of our app.
 */
export default function appWillStart(app, children) {
  // platform-specific setup (iOS/Android)
  platformSetup();

  // initialize FireBase
  initFireBase();

  // initialize notify utility, by injecting it to our App root
  return [React.Children.toArray(children), <Notify key="Notify"/>];
}
