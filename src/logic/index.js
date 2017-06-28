import communicateUnexpectedErrors from './communicateUnexpectedErrors';
import logActions                  from './logActions';
import bootstrap                   from './bootstrap';
import auth                        from './auth';

//***
//*** accumulation of all app logic
//***

export default [
  // handle dispatch-based unexpected errors ...
  communicateUnexpectedErrors,

  // log all dispatched actions ...
  logActions,

  // bootstrap startup processes
  ...bootstrap,

  // authorization processes
  ...auth,
];
