import firebaseInit     from './firebaseInit';
import locationService  from './locationService';
import authService      from './authService';
import eateryService    from './eateryService';
import discoveryService from './discoveryService';

export default [
  firebaseInit,
  ...locationService,
  ...authService,
  ...eateryService,
  ...discoveryService,
];
