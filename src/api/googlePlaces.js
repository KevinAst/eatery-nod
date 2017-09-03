import GooglePlaces from 'GooglePlaces';
import apiKey       from './googlePlacesApiKey';

const googlePlaces = GooglePlaces(apiKey, 'json');

/**
 * Retreive nearby resteraunts.
 * 
 * @param {Object} params the named params qualifying the search, ex:
 * 
 *   Search Ex:
 *     {
 *       location: [38.752209, -89.986610], // Glen Carbon
 *       radius:   16000,                   // 10 miles
 *       type:     'restaurant',
 *       minprice: 1,                       // ... NO-CAN-DO: for Date Night quality relay need 2 (elim Casey's General Store, DQ, etc)
 *       keyword:  'collinsville',          // OPTIONAL search qualifier (ex: eatery -or- town)
 *     }
 * 
 *   Next Page Ex:
 *     {
 *       pagetoken: pagetoken,
 *     }
 * 
 * @return {promise} a promise resolving to:
 *   {
 *     pagetoken: 'use-in-next-request', // undefined for no more pages (or 60 entries limit)
 *     eateries: [
 *       ... abbreviated attribute list
 *       id,
 *       name,
 *       addr,
 *       loc: {lat, lng}
 *     ]
 *   }
 */
export function nearBySearch(params) {
  // promise wrapped GooglePlaces API
  return new Promise( (resolve, reject) => {
    googlePlaces.nearBySearch(params, (err, resp) => {
      if (err) {
        // console.log(`xx *** ERROR-BY-ERR *** GooglePlaces nearBySearch: `, JSON.stringify(err));
        reject(err); // a JS Error object ... unsure how to stimulate
      }
      else if (resp.status === 'OK' || resp.status === 'ZERO_RESULTS') {
        const results = gp2eateries(resp);
        // console.log(`GooglePlaces nearBySearch (${results.eateries.length} entries): `, JSON.stringify(results)); // ... of interest: results.eateries[]
        resolve(results);
      }
      else { // bad return status (i.e. an invalid request) ... see: https://developers.google.com/places/web-service/search#PlaceSearchStatusCodes
        const errMsg = resp.error_message ? ` - ${resp.error_message}` : '';
        const appErr = new Error(`*** ERROR-BY-STATUS *** resp.status: ${resp.status}${errMsg}`);
        // console.log(`xx *** ERROR-BY-STATUS *** GooglePlaces nearBySearch: `, JSON.stringify(resp));
        reject(appErr);
      }
    });
  });
}


/**
 * Retreive details for supplied placeid.
 * 
 * @param {string} placeid the id for the detailed entry to return.
 * 
 * @return {promise} a promise resolving to:
 *   {
 *     id,
 *     name,
 *     phone,
 *     loc: {lat, lng},
 *     addr,
 *     navUrl,
 *     website,
 *   }
 */
export function getDetails(placeid) {
  // promise wrapped GooglePlaces API
  return new Promise( (resolve, reject) => {
    googlePlaces.placeDetailsRequest({placeid}, (err, resp) => {
      if (err) {
        // console.log(`xx *** ERROR-BY-ERR *** GooglePlaces placeDetailsRequest: `, JSON.stringify(err));
        reject(err); // a JS Error object ... unsure how to stimulate
      }
      else if (resp.status === 'OK') {
        const result = gp2eatery(resp.result);
        // console.log(`GooglePlaces placeDetailsRequest (${result.eateries.length} entries): `, JSON.stringify(result)); // ... of interest: result.eateries[]
        resolve(result);
      }
      else { // bad return status (i.e. an invalid request) ... see: https://developers.google.com/places/web-service/search#PlaceSearchStatusCodes
        const errMsg = resp.error_message ? ` - ${resp.error_message}` : '';
        const appErr = new Error(`*** ERROR-BY-STATUS *** resp.status: ${resp.status}${errMsg}`);
        // console.log(`xx *** ERROR-BY-STATUS *** GooglePlaces placeDetailsRequest: `, JSON.stringify(resp));
        reject(appErr);
      }
    });
  });
}


/**
 * Internal function that converts GooglePlaces respponse to an
 * app-specific eatery-nod structure.
 * 
 * @param {Object} gpResp the GooglePlaces response from
 * nearBySearch().
 * 
 * @return {Object} eatery-nod data structure.
 */
function gp2eateries(gpResp) {
  return {
    pagetoken: gpResp.next_page_token, // non-exist if NO additional pages (i.e. undefined)
    eateries:  gpResp.results.map( result => gp2eatery(result) )
  };
}


/**
 * Internal function that converts GooglePlaces respponse to an
 * app-specific eatery-nod structure.
 * 
 * @param {Object} gpResp the GooglePlaces response from either
 * nearBySearch() or getDetails().
 * 
 * @return {Object} eatery-nod data structure.
 */
function gp2eatery(gpResult) {
  return {
    id:      gpResult.place_id,
    name:    gpResult.name,
    phone:   gpResult.formatted_phone_number || 'not-in-search',
    loc:     gpResult.geometry.location,
    addr:    gpResult.formatted_address || gpResult.vicinity, // detail vs. search
    navUrl:  gpResult.url     || 'not-in-search',
    website: gpResult.website || 'not-in-search',
  };
}
