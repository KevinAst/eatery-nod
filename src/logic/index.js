import diag       from './diag';
import bootstrap  from './bootstrap';
import auth       from './auth';
import eateries   from './eateries';

//***
//*** accumulation of all app logic
//***

export default [
  // diagnostics (error handling, logging actions, etc.)
  ...diag,

  // bootstrap startup processes
  ...bootstrap,

  // authorization processes
  ...auth,

  // eateries processes
  ...eateries,
];
