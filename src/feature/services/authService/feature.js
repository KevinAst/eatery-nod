import {createFeature} from 'feature-u';
import AuthServiceAPI  from './AuthServiceAPI';
import User            from './User';

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
    define: {
      'User': User, // the User class (supports client re-instantiation from a serialized source (as retained in redux)
    },
  }
});

function objectOfTypeAuthServiceAPI(fassetsValue) {
  return fassetsValue instanceof AuthServiceAPI ? null : 'object of type AuthServiceAPI, NOT: ' + fassetsValue;
}
