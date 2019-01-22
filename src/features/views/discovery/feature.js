import {createFeature}  from 'feature-u';
import name             from './featureName';
import actions          from './actions'; // TODO: QUERKYNESS of IFormMeta (aggravated by feature-u) ... actions MUST be expanded BEFORE IFormMeta instance (eateryFilterFormMeta)
import reducer          from './state';
import logic            from './logic';
import route            from './route';
import DiscoveryLeftNavItem  from './comp/DiscoveryLeftNavItem';

// feature: discovery
//          manage and promotes the discovery view (a list of
//          "discoveries" from GooglePlaces).  Eateries can be
//          added/removed within the pool by simply
//          checking/unchecking the discoveries (full details in README)
export default createFeature({
  name,

  // our public face ...
  fassets: {
    defineUse: {
      'leftNavItem.DiscoveryItem': DiscoveryLeftNavItem, // inject our entry into the leftNav
    }
  },

  reducer,
  logic,
  route,
});
