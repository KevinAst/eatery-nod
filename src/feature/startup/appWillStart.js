import React            from 'react';
import platformSetup    from './init/platformSetup';
import Notify           from '../../util/notify'; 

/**
 * An app-level life-cycle hook, initializing our feature by:
 *  - performing platform-specific setup (iOS/Android)
 *  - and initialize the notify utility, by injecting it in our App root
 */
export default function appWillStart(app, children) {
  // platform-specific setup (iOS/Android)
  platformSetup();

  // initialize notify utility, by injecting it in our App root
  return [React.Children.toArray(children), <Notify key="Notify"/>];
}
