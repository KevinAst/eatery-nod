import apiKey    from './googlePlacesApiKey';
import verify    from '../util/verify';
import isString  from 'lodash.isstring';

// sample Google Places search:
// - Near By Place Search
//   ... https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=38.752209,-89.986610&radius=8000&type=restaurant&key=YOUR_API_KEY
// - Place Details
//   ... https://maps.googleapis.com/maps/api/place/details/json?placeid=xxx&key=YOUR_API_KEY

const googlePlacesBaseUrl = 'https://maps.googleapis.com/maps/api/place';
const esc                 = encodeURIComponent; // convenience alias

/**
 * Search/retreive nearby restaurants.
 * 
 * @param {[lat,lng]} namedArgs.location the geo location to base the
 * nearby search on.
 *
 * @param {number} namedArgs.radius the radius distance (in miles) to
 * search for (1-31), DEFAULT TO 5.
 *
 * @param {number} namedArgs.searchText an optional search text (ex:
 * restaurant name, or town, etc.).
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
export function searchEateries({location,
                                radius=5,
                                searchText='',
                                ...unknownArgs}={}) {

  // ***
  // *** validate parameters
  // ***

  const check = verify.prefix('api.discovery.searchEateries() parameter violation: ');

  check(location,                'location is required ... [lat,lng]'); // really need to check array of two numbers

  check(radius,                  'radius is required ... (1-31) miles');
  check(radius>=1 && radius<=31, `supplied radius (${radius}) must be between 1-31 miles`);

  check(isString(searchText),    `supplied searchText (${searchText}) must be a string`);

  const unknownArgKeys = Object.keys(unknownArgs);
  check(unknownArgKeys.length===0,  `unrecognized named parameter(s): ${unknownArgKeys}`);


  // ***
  // *** define our selection criteria
  // ***

  const selCrit = {
    // ... supplied by client (via params
    location,
    radius: miles2meters(radius),

    // ... hard coded by our "eatery" requirements
    type:     'restaurant',
    minprice: 1, // would like 2, but other params impact this too (keep at 1)
    key:      apiKey
  };
  // ... searchText is optional
  if (searchText) {
    selCrit.keyword = searchText;
  }

  // ***
  // *** define our URL, injecting the selCrit as a queryStr
  // ***

  const queryStr  = Object.keys(selCrit).map( k => `${esc(k)}=${esc(selCrit[k])}` ).join('&');
  const searchUrl = `${googlePlacesBaseUrl}/nearbysearch/json?${queryStr}`;
  // console.log(`xx api.discovery.searchEateries() searchUrl: '${searchUrl}'`);
  // ex: https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=38.752209%2C-89.98661&radius=16093.4&type=restaurant&minprice=1&key=SnipSnip

  // ***
  // *** issue our network retrieval, returning our promise
  // ***

  return fetch(searchUrl) // ?? response detail shown in sandbox/???? ?? remove the lengthy comments here
    .then( checkHttpResponseStatus ) // validate the http response status
    .then( validResp => {
      // validResp ...
      //   console.log(`xx http resp: `, validResp);
      //   sample ...
      //     resp = {
      //       type: "default",
      //       status: 200,
      //       ok: true,
      //       headers: {
      //         map: {
      //           ...
      //         },
      //       },
      //       url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=38.752209,-89.986610...BlaBlaBla",
      //       _bodyInit: "... payload json in string format (interpreted in resp.json) ...",
      //     }

      // convert payload to JSON
      // ... this is a promise (hence the usage of an additional .then())
      return validResp.json();
    })
    .then( payloadJson => {
      // payloadJson ...
      //   console.log(`xx payloadJson: `, payloadJson);
      //   sample ...
      //     payloadJson = {
      //       html_attributions: [],
      //       next_page_token: "... big monstor token OR null ...",
      //       results: [
      //         {
      //           geometry: {
      //             location: {
      //               lat: 38.79201130000001,
      //               lng: -89.951972
      //             },
      //             viewport: {
      //               ...
      //             }
      //           },
      //           icon: "https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png",
      //           id: "e572df56cbd029d57ffa784fc355645226224f23",
      //           name: "Buffalo Wild Wings",
      //           opening_hours: {
      //             open_now: true,
      //             weekday_text: []
      //           },
      //           photos: [
      //             ...
      //           ],
      //           place_id: "ChIJBQeK_Lr5dYgRrEQGF15hQHs",
      //           price_level: 1,
      //           rating: 4.1,
      //           reference: "...",
      //           scope: "GOOGLE",
      //           types: [
      //             "meal_takeaway",
      //             "bar",
      //             "restaurant",
      //             "food",
      //             "point_of_interest",
      //             "establishment"
      //           ],
      //           vicinity: "249 Harvard Drive, Edwardsville"
      //         },
      //         {
      //           ...
      //         },
      //       ],
      //       status: "OK"
      //     }

      // insure the GooglePlaces status field is acceptable
      if (payloadJson.status !== 'OK' && payloadJson.status !== 'ZERO_RESULTS') {
        const errMsg = payloadJson.error_message ? ` - ${payloadJson.error_message}` : '';
        // console.log(`xx *** ERROR-BY-GooglePlaces-STATUS *** GooglePlaces searchEateries: `, JSON.stringify(payloadJson));
        throw new Error(`*** ERROR-BY-GooglePlaces-STATUS *** payloadJson.status: ${payloadJson.status}${errMsg}`);
      }

      // convert to eatery
      const eateryResultsJson = gp2eateries(payloadJson);
      // console.log(`xx gp2eateries: `, eateryResultsJson);
      return eateryResultsJson;
    });
}


// ?? NEW FUNCTION
// ?? export function searchEateriesNext(pagetoken
//      const selCrit = {
//        // ... supplied by client (via params
//        pagetoken,
//      
//        // ... hard coded by our "eatery" requirements
//        key:      apiKey
//      };


/**
 * Retreive details for the supplied eateryId.
 * 
 * @param {string} eateryId the id for the detailed entry to retrieve
 * (same as Google Places place_id)
 * 
 * @return {promise} a promise resolving to eatery:
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
export function getEateryDetail(eateryId) {

  // ***
  // *** define our parameters
  // ***

  const params = {
    // ... supplied by client (via params)
    placeid: eateryId,

    // ... hard coded
    key:      apiKey
  };

  // ***
  // *** define our URL, injecting the params as a queryStr
  // ***

  const queryStr  = Object.keys(params).map( k => `${esc(k)}=${esc(params[k])}` ).join('&');
  const url = `${googlePlacesBaseUrl}/details/json?${queryStr}`;
  // console.log(`xx api.discovery.getEateryDetail() url: '${url}'`);
  // ex: https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJr7nIlGpV34cRlT0NYwJOLNg&key=SnipSnip

  // ***
  // *** issue our network retrieval, returning our promise
  // ***

  return fetch(url) // ?? response detail shown in sandbox/???
    .then( checkHttpResponseStatus ) // validate the http response status
    .then( validResp => {
      // convert payload to JSON
      // ... this is a promise (hence the usage of an additional .then())
      return validResp.json();
    })
    .then( payloadJson => {

      // interpret GooglePlaces status error conditions
      if (payloadJson.status !== 'OK') {
        const errMsg = payloadJson.error_message ? ` - ${payloadJson.error_message}` : '';
        // console.log(`xx *** ERROR-BY-GooglePlaces-STATUS *** GooglePlaces getEateryDetail: `, JSON.stringify(payloadJson));
        throw new Error(`*** ERROR-BY-GooglePlaces-STATUS *** payloadJson.status: ${payloadJson.status}${errMsg}`);
      }

      // convert to eatery
      const eatery = gp2eatery(payloadJson.result);
      // console.log(`xx gp2eatery: `, eatery);
      return eatery;
    });
}


/**
 * Internal function that converts GooglePlaces respponse to an
 * app-specific eatery-nod structure.
 * 
 * @param {Object} gpResp the GooglePlaces response from
 * searchEateries().
 * 
 * @return {Object} eatery-nod data structure.
 */
function gp2eateries(gpResp) {
  return {
    pagetoken: gpResp.next_page_token || null, // non-exist if NO additional pages (i.e. undefined)
    eateries:  gpResp.results.map( result => gp2eatery(result) )
  };
}


/**
 * Internal function that converts GooglePlaces respponse to an
 * app-specific eatery-nod structure.
 * 
 * @param {Object} gpResp the GooglePlaces response from either
 * searchEateries() or getEateryDetail().
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


/**
 * Convert supplied miles to meters.
 */
function miles2meters(miles) {
  return miles * 1609.34;
}


/**
 * Validate http response status.
 */
function checkHttpResponseStatus(resp) {
  if (resp.status >= 200 && resp.status < 300) {
    return resp; // valid
  } 
  else { // invalid
    const errMsg = resp.statusText ? ` - ${resp.statusText}` : '';
    let   err    = new Error(`*** ERROR-BY-HTTP-STATUS *** HTTP Fetch Status: ${resp.status}${errMsg}`);
    err.response = resp;
    throw err;
  }
}
