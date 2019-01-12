import firebaseInit     from './firebaseInit';
import locationService  from './locationService';
import authService      from './authService';
import eateryService    from './eateryService';

export default [
  firebaseInit,
  ...locationService,
  ...authService,
  ...eateryService,
  // ?? ...discoveryService,
];
