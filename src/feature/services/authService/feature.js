import {createFeature} from 'feature-u';
import AuthServiceAPI  from './AuthServiceAPI';

/**
 * The **'authService'** feature simply promotes the 'authService' use
 * contract, allowing feature-u to validate it's existence (as it is
 * supplied by other features - either real or mocked).
 */
export default createFeature({
  name: 'authService',

  fassets: {
    use: [
      ['authService', {required: true, type: objectOfTypeAuthServiceAPI}],
    ],
  }
});

function objectOfTypeAuthServiceAPI(fassetsValue) {
  return fassetsValue instanceof AuthServiceAPI ? null : 'object of type AuthServiceAPI, NOT: ' + fassetsValue;
}
