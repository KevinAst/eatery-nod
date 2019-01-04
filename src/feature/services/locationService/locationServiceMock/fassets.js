import LocationServiceMock from './LocationServiceMock';

/**
 * The Public Face promoted by this feature.
 *
 * We merely define a **mock** "locationService" that is promoted when we are not mocking.
 */
export default {
  defineUse: {
    'locationService': new LocationServiceMock(),
  },
};
