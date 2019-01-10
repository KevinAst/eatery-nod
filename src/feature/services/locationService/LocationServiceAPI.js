/**
 * LocationServiceAPI is a "pseudo" interface specifying the LocationService API
 * which all implementations (i.e. derivations) must conform.
 */
export default class LocationServiceAPI {

  /**
   * Return the current location asynchronously (via a promise).
   * 
   * @returns {Promise} the current location {lat, lng}
   */
  getCurrentPositionAsync() {
    throw new Error(`***ERROR*** ${this.constructor.name}.getCurrentPositionAsync() is a required service method that has NOT been implemented`);
  }

};
