import firebaseInit     from './firebaseInit';
import locationService  from './locationService';

export default [
  firebaseInit,
  ...locationService,
  // ?? eateryService
  // ?? discoveryService
];
