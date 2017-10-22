import apiKey    from './googlePlacesApiKey';
import verify    from '../common/util/verify';
import isString  from 'lodash.isstring';

// sample Google Places search:
// - Near By Place Search:
//   https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=38.752209,-89.986610&radius=8000&type=restaurant&key=YOUR_API_KEY
// - Place Details:
//   https://maps.googleapis.com/maps/api/place/details/json?placeid=xxx&key=YOUR_API_KEY

const googlePlacesBaseUrl = 'https://maps.googleapis.com/maps/api/place';
const esc                 = encodeURIComponent; // convenience alias

/**
 * Search/retreive nearby restaurants.
 * 
 * @param {[lat,lng]} namedArgs.loc the geo location to base the
 * nearby search on.
 *
 * @param {number} namedArgs.searchText an optional search text (ex:
 * restaurant name, or town, etc.).
 *
 * @param {number} namedArgs.distance the radius distance (in miles) to
 * search for (1-31), DEFAULT TO 5.
 *
 * @param {string} namedArgs.minprice the minimum price range '0'-'4'
 * (from most affordable to most expensive), DEFAULT TO '1'.
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
export function searchEateries({loc,
                                searchText='',
                                distance=5,
                                minprice='1',
                                pagetoken=null, // hidden/internal namedArg used by searchEateriesNextPage()
                                ...unknownArgs}={}) {

  // ***
  // *** validate parameters
  // ***

  const check = verify.prefix('api.discovery.searchEateries() parameter violation: ');

  if (!pagetoken) {
    check(loc,                            'loc is required ... [lat,lng]'); // really need to check array of two numbers
    
    check(isString(searchText),           `supplied searchText (${searchText}) must be a string`);
    
    check(distance,                       'distance is required ... (1-31) miles');
    check(distance>=1 && distance<=31,    `supplied distance (${distance}) must be between 1-31 miles`);
    
    check(minprice,                       'minprice is required ... (0-4)');
    check(minprice>='0' && minprice<='4', `supplied minprice (${minprice}) must be between 0-4`);
    
    const unknownArgKeys = Object.keys(unknownArgs);
    check(unknownArgKeys.length===0,      `unrecognized named parameter(s): ${unknownArgKeys}`);
  }


  // ***
  // *** define our selection criteria
  // ***

  let selCrit = null;

  if (pagetoken) { // next-page requests ... from searchEateriesNextPage()
    selCrit = {
      pagetoken,
      key: apiKey
    };
  }
  else {
    selCrit = {
      // ... supplied by client (via params
      location: loc,
      radius:   miles2meters(distance),
      minprice,

      // ... hard coded by our "eatery" requirements
      type:     'restaurant',
      key:      apiKey
    };

    // ... searchText is optional
    if (searchText) {
      selCrit.keyword = searchText;
    }
  }

  // DETAIL_SAMPLE: sandbox/GooglePlaces/discovery/sample.searchEateries.input.selCrit.js
  // console.log(`xx sample.searchEateries.input.selCrit: `, selCrit);


  // ***
  // *** define our URL, injecting the selCrit as a queryStr
  // ***

  const queryStr  = Object.keys(selCrit).map( k => `${esc(k)}=${esc(selCrit[k])}` ).join('&');
  const searchUrl = `${googlePlacesBaseUrl}/nearbysearch/json?${queryStr}`;

  // DETAIL_SAMPLE: sandbox/GooglePlaces/discovery/sample.searchEateries.input.queryStr.txt
  // console.log(`xx sample.searchEateries.input.queryStr: `, queryStr);

  // DETAIL_SAMPLE: sandbox/GooglePlaces/discovery/sample.searchEateries.input.searchUrl.txt
  // console.log(`xx sample.searchEateries.input.searchUrl: `, searchUrl);


  // ***
  // *** issue our network retrieval, returning our promise
  // ***

  return fetch(searchUrl)
    .then( checkHttpResponseStatus ) // validate the http response status
    .then( validResp => {
      // DETAIL_SAMPLE: sandbox/GooglePlaces/discovery/sample.searchEateries.output.validResp.txt
      // console.log(`xx sample.searchEateries.output.validResp: `, validResp);

      // convert payload to JSON
      // ... this is a promise (hence the usage of an additional .then())
      return validResp.json();
    })
    .then( payloadJson => {
      // DETAIL_SAMPLE: sandbox/GooglePlaces/discovery/sample.searchEateries.output.payloadJson.js
      // console.log(`xx sample.searchEateries.output.payloadJson: `, JSON.stringify(payloadJson));

      // insure the GooglePlaces status field is acceptable
      if (payloadJson.status !== 'OK' && payloadJson.status !== 'ZERO_RESULTS') {
        const errMsg = payloadJson.error_message ? ` - ${payloadJson.error_message}` : '';
        // console.log(`xx *** ERROR-BY-GooglePlaces-STATUS *** GooglePlaces searchEateries: `, JSON.stringify(payloadJson));
        throw new Error(`*** ERROR-BY-GooglePlaces-STATUS *** payloadJson.status: ${payloadJson.status}${errMsg}`);
      }

      // convert to eatery
      const eateryResultsJson = gp2eateries(payloadJson);
      // DETAIL_SAMPLE: sandbox/GooglePlaces/discovery/sample.searchEateries.output.eateryResultsJson.js
      // console.log(`xx sample.searchEateries.output.eateryResultsJson: `, JSON.stringify(eateryResultsJson));

      return eateryResultsJson;
    });
}


/**
 * Search eateries next-page request.
 * 
 * @param pagetoken the next page token (supplied by prior
 * searchEateries() invocation).
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
export function searchEateriesNextPage(pagetoken) {

  const check = verify.prefix('api.discovery.searchEateriesNextPage() parameter violation: ');
  check(pagetoken, 'pagetoken is required');
  check(isString(pagetoken), `supplied pagetoken (${pagetoken}) must be a string`);
  
  return searchEateries({pagetoken});
}


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

  // DETAIL_SAMPLE: sandbox/GooglePlaces/discovery/sample.getEateryDetail.input.params.js
  // console.log(`xx sample.getEateryDetail.input.params: `, params);


  // ***
  // *** define our URL, injecting the params as a queryStr
  // ***

  const queryStr  = Object.keys(params).map( k => `${esc(k)}=${esc(params[k])}` ).join('&');
  const url = `${googlePlacesBaseUrl}/details/json?${queryStr}`;

  // DETAIL_SAMPLE: sandbox/GooglePlaces/discovery/sample.getEateryDetail.input.queryStr.txt
  // console.log(`xx sample.getEateryDetail.input.queryStr: `, queryStr);

  // DETAIL_SAMPLE: sandbox/GooglePlaces/discovery/sample.getEateryDetail.input.url.txt
  // console.log(`xx sample.getEateryDetail.input.url: `, url);


  // ***
  // *** issue our network retrieval, returning our promise
  // ***

  return fetch(url)
    .then( checkHttpResponseStatus ) // validate the http response status
    .then( validResp => {
      // DETAIL_SAMPLE: sandbox/GooglePlaces/discovery/sample.getEateryDetail.output.validResp.txt
      // console.log(`xx sample.getEateryDetail.output.validResp: `, validResp);

      // convert payload to JSON
      // ... this is a promise (hence the usage of an additional .then())
      return validResp.json();
    })
    .then( payloadJson => {

      // DETAIL_SAMPLE: sandbox/GooglePlaces/discovery/sample.getEateryDetail.output.payloadJson.js
      // console.log(`xx sample.getEateryDetail.output.payloadJson: `, JSON.stringify(payloadJson));

      // interpret GooglePlaces status error conditions
      if (payloadJson.status !== 'OK') {
        const errMsg = payloadJson.error_message ? ` - ${payloadJson.error_message}` : '';
        // console.log(`xx *** ERROR-BY-GooglePlaces-STATUS *** GooglePlaces getEateryDetail: `, JSON.stringify(payloadJson));
        throw new Error(`*** ERROR-BY-GooglePlaces-STATUS *** payloadJson.status: ${payloadJson.status}${errMsg}`);
      }

      // convert to eatery
      const eatery = gp2eatery(payloadJson.result);
      // DETAIL_SAMPLE: sandbox/GooglePlaces/discovery/sample.getEateryDetail.output.eatery.js
      // console.log(`xx sample.getEateryDetail.output.eatery: `, JSON.stringify(eatery));

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

  // DETAIL_SAMPLE: sandbox/GooglePlaces/discovery/sample.searchEateries.output.resp.txt
  // DETAIL_SAMPLE: sandbox/GooglePlaces/discovery/sample.getEateryDetail.output.resp.txt
  // console.log(`xx sample.searchEateries.output.resp: `, resp);

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
