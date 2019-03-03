# eatery-nod app

The **eatery-nod** application is composed of the following **features**:

 - [**device**](device/README.md):                         initializes the device for use by the app
   - [**deviceService**](device/deviceService/README.md):  promotes several device related services

 - [**auth**](auth/README.md):                      promotes complete user authentication
   - [**authService**](auth/authService/README.md): a persistent authentication service (retaining active user)
     <!-- NOTE: no README.md for these features (currently using the class) -->
     - [**authServiceFirebase**](auth/authService/authServiceFirebase/AuthServiceFirebase.js): the **real** AuthServiceAPI derivation based on Firebase
     - [**authServiceMock**](auth/authService/authServiceMock/AuthServiceMock.js):             the **mock** AuthServiceAPI derivation

 - [**eateries**](eateries/README.md):                      manages and promotes the eateries view
   - [**eateryService**](eateries/eateryService/README.md): a persistent "Eateries" DB service, monitoring real-time Eatery DB activity
     <!-- NOTE: no README.md for these features (currently using the class) -->
     - [**eateryServiceFirebase**](eateries/eateryService/eateryServiceFirebase/EateryServiceFirebase.js): the **real** EateryServiceAPI derivation based on Firebase
     - [**eateryServiceMock**](eateries/eateryService/eateryServiceMock/EateryServiceMock.js):             the **mock** EateryServiceAPI derivation

 - [**discovery**](discovery/README.md):                           manages and promotes the discovery view
   - [**discoveryService**](discovery/discoveryService/README.md): retrieves restaurant information from a geoxsgraphical data source, emitting Discovery/Eatery objects
     <!-- NOTE: no README.md for these features (currently using the class) -->
     - [**discoveryServiceGooglePlaces**](discovery/discoveryService/discoveryServiceGooglePlaces/DiscoveryServiceGooglePlaces.js): the **real** DiscoveryServiceAPI derivation based on GooglePlaces API
     - [**discoveryServiceMock**](discovery/discoveryService/discoveryServiceMock/DiscoveryServiceMock.js):                         the **mock** DiscoveryServiceAPI derivation

 - [**util**](util/README.md):                        a collection of **"Support Utility"** features
   - [**leftNav**](util/leftNav/README.md):           promotes the app-specific Drawer/SideBar on the app's left side
   - [**currentView**](util/currentView/README.md):   maintains the currentView state with get/set cross-feature bindings
   - [**bootstrap**](util/bootstrap/README.md):       provide critical-path app initialization through the `'bootstrap.*'` use contract
   - [**firebaseInit**](util/firebaseInit/README.md): promote a utility function to initialize the eatery-nod firebase DB

 - [**diagnostic**](diagnostic/README.md):              a collection of **"Diagnostic Related"** features
   - [**logActions**](diagnostic/logActions/README.md): logs all dispatched actions and resulting state
   - [**sandbox**](diagnostic/sandbox/README.md):       promotes a variety of interactive tests, used in development, that can easily be disabled
