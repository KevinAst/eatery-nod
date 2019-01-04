import LocationServiceAPI from './LocationServiceAPI';

/**
 * The Public Face promoted by this feature.
 *
 * We merely specify the "locationService" use contract, allowing
 * feature-u to validate it's existance (supplied by other features
 * ... either real or mocked).
 */
export default {
  use: [
    ['locationService', {required: true, type: objectOfTypeLocationServiceAPI}],
  ],
};

function objectOfTypeLocationServiceAPI(fassetsValue) {
  return fassetsValue instanceof LocationServiceAPI ? null : 'object of type LocationServiceAPI, NOT: ' + fassetsValue;
}
