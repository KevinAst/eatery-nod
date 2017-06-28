import diag       from './diag';
import bootstrap  from './bootstrap';
import auth       from './auth';

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
];
