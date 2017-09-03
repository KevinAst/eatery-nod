import GooglePlaces from 'GooglePlaces';
import apiKey       from '../../src/api/googlePlacesApiKey';

const googlePlaces = GooglePlaces(apiKey, 'json');

const locate = `Bella Milano`;

const params = {
  location: [38.752209, -89.986610], // Glen Carbon
  radius:   50000,                   // 31 miles
  // type:     'restaurant',         // ... removed to find Copper Dock Winery
  keyword:  locate,                  // ... use keyword (or name) to search for a known restaurant ... example: name: 'Fazzi'
};

const params2 = {
  location: [38.752209, -89.986610], // Glen Carbon
  radius:   8000,                    // 5 miles
  type:     'restaurant',            // ... removed to find Copper Dock Winery
  keyword:  'collinsville',          // ... 'town IL' WORKS ... 'town" WORKS (a bit different results but still looks good)
};

googlePlaces.nearBySearch(params2, (err, resp) => {
  if (err) throw err;
  console.log(`GooglePlaces nearBySearch (${resp.results.length} entries): `, JSON.stringify(resp)); // ... of interest: resp.results[]

  // ? // *** try a detailed retrieval
  // ? const entry = resp.results[0];
  // ? console.log(`\n\n\n ISSUING NEXT PAGE REQUEST: for '${entry.name}'`);
  // ? const detailParams = {
  // ?   placeid: entry.place_id,
  // ? };
  // ? googlePlaces.placeDetailsRequest(detailParams, (err, resp) => {
  // ?   if (err) throw err;
  // ?   console.log(`GooglePlaces DETAILS: `, JSON.stringify(resp)); // ... of interest: resp.result IS the detailed entry
  // ? });

});
