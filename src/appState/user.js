import {combineReducers}  from 'redux';
import status             from './status';
import email              from './email';
import name               from './name';
import pool               from './pool';

export default combineReducers({
  status,
  email,
  name,
  pool,
});
