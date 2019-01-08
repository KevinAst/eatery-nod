import authService         from './feature';
import authServiceFirebase from './authServiceFirebase/feature';
// import authServiceMock     from './authServiceMock/feature'; ?? L8TR

export default [
  authService,
  authServiceFirebase,
//authServiceMock,
];
