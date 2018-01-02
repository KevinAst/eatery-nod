import React   from 'react';
import Notify  from '../../util/notify'; 

/**
 * Inject our Notify component at the root of our app, using API:
 * `injectRootAppElmForStateRouter()` required when using the
 * `routAspect`.
 */
export default function injectRootAppElmForStateRouter(curRootAppElm, app) {
  // initialize notify utility, by injecting it in our App root
  return [React.Children.toArray(curRootAppElm), <Notify key="Notify"/>];
}
