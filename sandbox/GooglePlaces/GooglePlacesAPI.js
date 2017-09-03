import * as googlePlacesAPI from '../../src/api/googlePlaces';


const initialRequest = {
location: [38.752209, -89.986610], // Glen Carbon
//location: [38.7682273, -89.9906723], // Glen Carbon from web xx FOR SOME REASON, retrieval started returning results from St. Louis / Bridgton
//location: [38.7658418, -89.9921465], // Glen Carbon from web

//radius NOT ALLOWED when using rankby: 'distance'
//radius:  50000,                    // 31 miles ... BAD this range starts returning results from St. Louis / Bridgton
//radius:  30000,                    // 20 miles ... BAD this range starts returning results from St. Louis / Bridgton
  radius:  16000,                    // 10 miles
//radius:   8000,                    //  5 miles

  type:     'restaurant',            // ... use keyword (or name) to search for a known restaurant ... example: name: 'Fazzi'

  minprice: 1,                       // ... for Date Night quality relay need 2 (elim Casey's General Store, DQ, etc)
                                     //     POOP: when set to 2
                                     //           - normal  radius 16000 (10 miles) returns 8 entries, including China King
                                     //           - max out radius 50000 (31 miles) returns 19 entries from St. Louis ... GEEZE
                                     //           - try     radius 30000 (20 miles) returns 19 entries from St. Louis ... GEEZE
                                     //     PUNT: set to 1 and get trashy non-date night eateries
                                     //           BOTTOM LINE: don't think minprices is very well maintained

//rankby:   'distance',              // hmmmm - prevents radius from being used
};


// ***
// *** try a nearby search
// ***
googlePlacesAPI.nearBySearch(initialRequest)
  .then(resp => {
    console.log(`*** WORKED *** googlePlacesAPI nearBySearch (${resp.eateries.length} entries): `, JSON.stringify(resp)); // ... of interest: resp.eateries[]

    // ***
    // *** try a continuation
    // ***
    setTimeout( () => {
      console.log(`\n\n\nISSUING NEXT PAGE REQUEST (after a short timeout to prevent INVALID_REQUEST response):`);
      if (!resp.pagetoken) {
        console.log(`hmmmm ... NO additional pages to retrieve`);
        return;
      }
      const nextRequest = {
        pagetoken: resp.pagetoken
      };
      googlePlacesAPI.nearBySearch(nextRequest)
        .then(resp => {
          console.log(`*** WORKED *** googlePlacesAPI nearBySearch (continuation) (${resp.eateries.length} entries): `, JSON.stringify(resp)); // ... of interest: resp.eateries[]
        })
        .catch(err => {
          console.log(`*** ERROR *** googlePlacesAPI nearBySearch (continuation) ... ${''+err} ... for nextRequest: `, JSON.stringify(nextRequest));
        });
    }, 2000);

    // ***
    // *** try a detailed retrieval
    // ***
    const eatery = resp.eateries[0];
    console.log(`\n\n\n ISSUING DETAILED RETRIEVAL: for '${eatery.name}'`);
    googlePlacesAPI.getDetails(eatery.id)
      .then(eatery => {
        console.log(`*** WORKED *** googlePlacesAPI getDetails: `, JSON.stringify(eatery));
      })
      .catch(err => {
        console.log(`*** ERROR *** googlePlacesAPI getDetails ... ${''+err}`);
      });

  })
  .catch(err => {
    console.log(`*** ERROR *** googlePlacesAPI nearBySearch ... ${''+err}`);
  });
