import {createFeature}    from 'feature-u';
import LocationServiceAPI from './LocationServiceAPI';

/**
 * The **'locationService'** feature promotes a GPS location service
 * through the `locationService` fassets reference (**feature-u**'s Cross
 * Feature Communication mechanism).
 *
 *
 * ## API
 *
 * A complete API reference can be found in the
 * [LocationServiceAPI](LocationServiceAPI.js) class.
 *
 *
 * ## Example
 *
 * Access is provided through the **feature-u** `fassets` reference:
 *
 * ```js
 * fassets.locationService.getCurrentPositionAsync()
 * ```
 *
 *
 * ## Mocking
 *
 * This service can be "mocked" through app-specific
 * [featureFlag](../../../util/featureFlags.js) settings.
 *
 * This "base" feature merely specifies the `locationService` **use
 * contract**, supporting **feature-u** validation: _a required resource
 * of type: `LocationServiceAPI`_.
 *
 * The actual definition of the service is supplied by other features
 * (through the `defineUse` directive), either real or mocked (as
 * directed by `featureFlags.mockGPS`).
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
