import firebaseInit     from './firebaseInit';
import locationService  from './locationService';
import authService      from './authService';

export default [
  firebaseInit,
  ...locationService,
  ...authService,
  // ?? eateryService
  // ?? discoveryService
];
