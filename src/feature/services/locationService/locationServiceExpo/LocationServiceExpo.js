import {Location,
        Permissions}      from 'expo';
import LocationServiceAPI from '../LocationServiceAPI';

/**
 * LocationServiceExpo is the **real** LocationServiceAPI derivation
 * using the Expo service APIs.
 */
export default class LocationServiceExpo extends LocationServiceAPI {

  /**
   * Return the current location asynchronously (via a promise).
   * 
   * @returns {Promise} the current location {lat, lng}
   */
  getCurrentPositionAsync() {

    return new Promise( (resolve, reject) => {

      Permissions.askAsync(Permissions.LOCATION)
                 .then( ({status}) => {

                   // Device LOCATION permission denied
                   if (status !== 'granted') {
                     return reject(
                       new Error(`Device LOCATION permission denied, status: ${status}`)
                         .defineClientMsg('No access to device location')
                         .defineAttemptingToMsg('obtain current position')
                     );
                   }

                   // obtain device geo location
                   Location.getCurrentPositionAsync({})
                           .then( (location) => {
                             // console.log(`xx Obtained Device Location: `, location);
                             // Obtained Device Location: {
                             //   "coords": {
                             //     "accuracy":   50,
                             //     "altitude":   0,
                             //     "heading":    0,
                             //     "latitude":   38.7657446, // of interest
                             //     "longitude": -89.9923039, // of interest
                             //     "speed":      0,
                             //   },
                             //   "mocked":    false,
                             //   "timestamp": 1507050033634,
                             // }
      
                             // communicate device location
                             return resolve({lat: location.coords.latitude, 
                                             lng: location.coords.longitude});
                           })
                           .catch( err => {
                             return reject(err.defineClientMsg('Could not obtain device location'));
                           });
                 })

                 .catch( err => {
                   return reject(err.defineAttemptingToMsg('obtain current position'));
                 });
    });
  }

};
