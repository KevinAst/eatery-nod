import LocationServiceExpo from './LocationServiceExpo';

/**
 * The Public Face promoted by this feature.
 *
 * We merely define the **real** "locationService" that is promoted when we are not mocking.
 */
export default {
  defineUse: {
    'locationService': new LocationServiceExpo(),
  },
};
