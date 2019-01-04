import LocationServiceAPI from '../LocationServiceAPI';

/**
 * LocationServiceMock is the **mock** LocationServiceAPI derivation.
 */
export default class LocationServiceMock extends LocationServiceAPI {

  /**
   * Return the current location asynchronously (via a promise).
   * 
   * @returns {Promise} a mocked current location {lat, lng}
   */
  getCurrentPositionAsync() {

    return new Promise( (resolve, reject) => {

      // resolve to Glen Carbon (hardcoded) after a bit of time
      setTimeout(() => {
        return resolve({lat: 38.7657446, 
                        lng: -89.9923039});
            
      }, 500);

    });
  }

};
