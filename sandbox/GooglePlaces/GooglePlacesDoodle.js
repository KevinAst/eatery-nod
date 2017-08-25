import GooglePlaces from 'GooglePlaces';
import apiKey       from './apiKey';

const googlePlaces = GooglePlaces(apiKey, 'json');

const params = {
  location: [38.752209, -89.986610], // Glen Carbon
  radius:   8000,                    // 5 miles
  type:     'restaurant',            // ... use keyword (or name) to search for a known restaurant ... example: name: 'Fazzi'
};

googlePlaces.nearBySearch(params, (err, resp) => {
  if (err) throw err;
  console.log(`GooglePlaces nearBySearch: `, JSON.stringify(resp)); // ... of interest: resp.results[]

  // *** try a detailed retrieval
  const entry = resp.results[0];
  console.log(`\n\n\n ISSUING NEXT PAGE REQUEST: for '${entry.name}'`);
  const detailParams = {
    placeid: entry.place_id,
  };
  googlePlaces.placeDetailsRequest(detailParams, (err, resp) => {
    if (err) throw err;
    console.log(`GooglePlaces DETAILS: `, JSON.stringify(resp)); // ... of interest: resp.result IS the detailed entry
  });

  // *** try a continuation!
  console.log(`\n\n\nISSUING NEXT PAGE REQUEST:`);
  const nextParams = {
    pagetoken: resp.next_page_token,
  };
  googlePlaces.nearBySearch(nextParams, (err, resp) => {
    if (err) throw err;
    console.log(`GooglePlaces NEXT nearBySearch: `, JSON.stringify(resp)); // ... of interest: resp.results[]
  });

});
