import {createFeature}    from 'feature-u';
import LocationServiceAPI from './LocationServiceAPI';

/**
 * The **'locationService'** feature simply promotes the
 * 'locationService' use contract.
 *
 * This allows feature-u to validate it's existence, because it is
 * supplied by other features (either real or mocked).
 */
export default createFeature({
  name:    'locationService',

  fassets: {
    use: [
      ['locationService', {required: true, type: objectOfTypeLocationServiceAPI}],
    ],
  }
});

function objectOfTypeLocationServiceAPI(fassetsValue) {
  return fassetsValue instanceof LocationServiceAPI ? null : 'object of type LocationServiceAPI, NOT: ' + fassetsValue;
}
