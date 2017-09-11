import 'isomorphic-fetch';  // NOTE: define fetch(), emulating what react-native packager injects automatically (this is an implied dependency module from expo)
import * as discoveryAPI from '../../src/api/discovery';

// ***
// *** test GooglePlaces via our Discovery API
// ***

const selCrit = {
  location: [38.752209, -89.986610], // Glen Carbon
  radius:   10,                      // 10 miles
};

// ***
// *** try a nearby search
// ***
discoveryAPI.searchEateries(selCrit)
  .then(resp => {
    console.log(`*** WORKED *** discoveryAPI searchEateries (${resp.eateries.length} entries): `, JSON.stringify(resp)); // ... of interest: resp.eateries[]

    // ***
    // *** try a continuation
    // ***
    setTimeout( () => { // timeout is necessary to make it valid (next requests are invalid by google, unless some time has expired)
      console.log(`\n\n\nISSUING NEXT PAGE REQUEST (after a short timeout to prevent INVALID_REQUEST response):`);
      if (!resp.pagetoken) {
        console.log(`hmmmm ... NO additional pages to retrieve`);
        return;
      }
      const nextRequest = { // ?? TRASH
        pagetoken: resp.pagetoken
      };
      discoveryAPI.searchEateriesNextPage(resp.pagetoken)
        .then(resp => {
          console.log(`*** WORKED *** discoveryAPI searchEateriesNextPage (${resp.eateries.length} entries): `, JSON.stringify(resp)); // ... of interest: resp.eateries[]
        })
        .catch(err => {
          console.log(`*** ERROR *** discoveryAPI searchEateriesNextPage ... ${''+err} ... for next pagetoken '${resp.pagetoken}'`);
        });
    }, 2000);

    // ***
    // *** try a detailed retrieval
    // ***
    const eatery = resp.eateries[0];
    console.log(`\n\n\n ISSUING DETAILED RETRIEVAL: for '${eatery.name}'`);
    discoveryAPI.getEateryDetail(eatery.id)
      .then(eatery => {
        console.log(`*** WORKED *** discoveryAPI getEateryDetail: `, JSON.stringify(eatery));
      })
      .catch(err => {
        console.log(`*** ERROR *** discoveryAPI getEateryDetail ... ${''+err}`, err);
      });

  })
  .catch(err => {
    console.log(`*** ERROR *** discoveryAPI searchEateries ... ${''+err}`);
  });
