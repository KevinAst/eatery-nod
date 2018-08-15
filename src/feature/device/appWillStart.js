import React          from 'react';
import platformSetup  from './init/platformSetup';
import Notify         from '../../util/notify';

/**
 * An app-level life-cycle hook, initializing our feature by:
 *  - performing platform-specific setup (iOS/Android)
 *  - inject our notify utility in the root DOM
 */
export default function appWillStart({fassets, curRootAppElm}) {
  // platform-specific setup (iOS/Android)
  platformSetup();

  // initialize notify utility, by injecting it in our App root
  return [React.Children.toArray(curRootAppElm), <Notify key="Notify"/>];
}
