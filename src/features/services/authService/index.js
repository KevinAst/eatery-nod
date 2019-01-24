import authService         from './feature';
import authServiceFirebase from './authServiceFirebase/feature';
import authServiceMock     from './authServiceMock/feature';

export default [
  authService,
  authServiceFirebase,
  authServiceMock,
];
