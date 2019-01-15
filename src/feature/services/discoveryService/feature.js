import {createFeature}      from 'feature-u';
import DiscoveryServiceAPI  from './DiscoveryServiceAPI';

/**
 * The **discoveryService** feature promotes a service that retrieves
 * restaurant information from a geographical data source, through the
 * `discoveryService` fassets reference (**feature-u**'s Cross Feature
 * Communication mechanism).
 *
 *
 * ## API
 *
 * A complete API reference can be found in the
 * [DiscoveryServiceAPI](DiscoveryServiceAPI.js) class.
 *
 *
 * ## Example
 *
 * Access is provided through the **feature-u** `fassets` reference:
 *
 * ```js
 * fassets.discoveryService.searchDiscoveries({...})
 * ```
 *
 *
 * ## Mocking
 *
 * This service can be "mocked" through app-specific
 * [featureFlag](../../../util/featureFlags.js) settings.
 *
 * This "base" feature merely specifies the `discoveryService` **use
 * contract**, supporting **feature-u** validation: _a required resource
 * of type: `DiscoveryServiceAPI`_.
 *
 * The actual definition of the service is supplied by other features
 * (through the `defineUse` directive), either real or mocked (as
 * directed by `featureFlags.useWIFI`).
 */
export default createFeature({
  name: 'discoveryService',

  fassets: {
    use: [
      ['discoveryService', {required: true, type: objectOfTypeDiscoveryServiceAPI}],
    ],
  }
});

function objectOfTypeDiscoveryServiceAPI(fassetsValue) {
  return fassetsValue instanceof DiscoveryServiceAPI ? null : 'object of type DiscoveryServiceAPI, NOT: ' + fassetsValue;
}
