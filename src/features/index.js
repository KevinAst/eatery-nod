import device                        from './init/device/feature';
import auth                          from './init/auth/feature';

import eateries                      from './views/eateries/feature';
import discovery                     from './views/discovery/feature';
import leftNav                       from './views/leftNav/feature';
import currentView                   from './views/currentView/feature';

import deviceService                 from './services/deviceService/feature';

import authService                   from './services/authService/feature';
import authServiceFirebase           from './services/authService/authServiceFirebase/feature';
import authServiceMock               from './services/authService/authServiceMock/feature';

import eateryService                 from './services/eateryService/feature';
import eateryServiceFirebase         from './services/eateryService/eateryServiceFirebase/feature';
import eateryServiceMock             from './services/eateryService/eateryServiceMock/feature';

import discoveryService              from './services/discoveryService/feature';
import discoveryServiceGooglePlaces  from './services/discoveryService/discoveryServiceGooglePlaces/feature';
import discoveryServiceMock          from './services/discoveryService/discoveryServiceMock/feature';

import bootstrap                     from './support/bootstrap/feature';
import firebaseInit                  from './support/firebaseInit/feature';

import logActions                    from './diag/logActions/feature';
import sandbox                       from './diag/sandbox/feature';

// accumulate ALL features
// ... see README.md for details
export default [

  // ... init
  device,
  auth,

  // ... views
  eateries,
  discovery,
  leftNav,
  currentView,

  // ... services
  deviceService,

  authService,
  authServiceFirebase,
  authServiceMock,

  eateryService,
  eateryServiceFirebase,
  eateryServiceMock,

  discoveryService,
  discoveryServiceGooglePlaces,
  discoveryServiceMock,

  // ... support
  bootstrap,
  firebaseInit,

  // ... diag
  logActions,
  sandbox,
];
