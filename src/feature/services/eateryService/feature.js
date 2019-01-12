import {createFeature}   from 'feature-u';
import EateryServiceAPI  from './EateryServiceAPI';

/**
 * The **'eateryService'** feature simply promotes the 'eateryService' use
 * contract, allowing feature-u to validate it's existence (as it is
 * supplied by other features - either real or mocked).
 */
export default createFeature({
  name: 'eateryService',

  fassets: {
    use: [
      ['eateryService', {required: true, type: objectOfTypeEateryServiceAPI}],
    ],
  }
});

function objectOfTypeEateryServiceAPI(fassetsValue) {
  return fassetsValue instanceof EateryServiceAPI ? null : 'object of type EateryServiceAPI, NOT: ' + fassetsValue;
}
