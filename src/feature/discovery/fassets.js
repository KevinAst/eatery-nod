import actions               from './actions';
import featureName           from './featureName';
import DiscoveryLeftNavItem  from './comp/DiscoveryLeftNavItem';

/**
 * The Public Face promoted by this feature.
 */
export default {

  defineUse: {
    'leftNavItem.DiscoveryItem': DiscoveryLeftNavItem, // inject our entry into the leftNav
  }
};
