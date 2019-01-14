import {createFeature}      from 'feature-u';
import DiscoveryServiceAPI  from './DiscoveryServiceAPI';

/**
 * The **'discoveryService'** feature simply promotes the
 * 'discoveryService' use contract, allowing feature-u to validate
 * it's existence (as it is supplied by other features - either real
 * or mocked).
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
