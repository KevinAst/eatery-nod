import {createLogic}      from 'redux-logic';
import featureName        from './featureName';
import actions            from './actions';
import discloseError      from '../../../util/discloseError';

/**
 * Administer the "kickStart" initialization process, initiated by
 * dispatching the `kickStart()` action.
 * 
 * A kickStart is a client-specific critical-path initialization that
 * must be completed before the app can run.
 * 
 * KickStarts can be supplied by any number of features, under the
 * `'kickStart.*'` fassets use contract.  These are functions (created
 * through `createKickStart()`), that perform any critical-path
 * client-specific initialization.  All kickStarts will run to
 * completion before this administrative process is finished (as
 * denoted by the `ready()` action).
 * 
 * Actions that are emitted by this process are:
 * 
 *  - setStatus(statusMsg)
 *  
 *    Status is a human interpretable representation of the kickStart
 *    process (e.g. 'Waiting for bla bla bla' -or- 'READY').
 * 
 *    This status can optionally be used (say by a SplashScreen) as
 *    user communication of what is going on.
 * 
 *  - client-specific actions
 * 
 *    These actions can optionally emitted by client-specific
 *    kickStarts.  As an example, a device feature's kickStart may
 *    need to retain it's GPS location.
 * 
 *  - ready()
 * 
 *    This is a **fundamental result** of the kickStart process
 *    completion.  It indications that all kickStarts have completed,
 *    and the app is fully initialized and ready to run.
 * 
 *    This action is typically monitored by an external feature to
 *    start the app.
 */
export const kickStart = createLogic({

  name: `${featureName}.kickStart`,
  type: String(actions.kickStart),
  warnTimeout: 0, // long-running process (runs till all kickStart initialization has completed)
  
  process({getState, action, fassets}, dispatch, done) {

    // identify the various kickStart items to process
    // ... employing our use contract
    const kickStarts = fassets.get('kickStart.*'); // kickStart[]

    // initialize all kickStarts to an un-processed status
    kickStarts.forEach( (kickStart) => kickStart.complete = false );

    // helper to "wrapup" when all kickStart initialization has completed
    function wrapup() {
      dispatch( actions.setStatus('READY') ); // maintain our status as ready
      dispatch( actions.ready() );            // the fundamental action that triggers downstream processes
      done();
    }

    // no-op if there are NO kickStarts ... there is nothing to do
    if (kickStarts.length === 0) {
      wrapup();
      return;
    }

    // helper that monitors the completion of each kickStart
    // ... optionally with the supplied err
    function kickStartFinished(kickStart, err=null) {

      // mark kickStart as completed
      // ... unless there is an unexpected error
      if (!err || !err.isUnexpected()) {
        kickStart.complete = true;
      }

      // handle error conditions
      if (err) {
        // add the "what" context to this raw error
        err.defineAttemptingToMsg(kickStart.kickStartWhat);

        // disclose the error to the user -and- log it
        discloseError({err, logIt:true});
      }

      // change our status to one of the "open" un-processed kickStarts
      // ... giving user visibility of what is being done
      // ... e.g. 'Waiting for bla bla bla'
      const nextKickStart = kickStarts.find( (kickStart) => !kickStart.complete );
      if (nextKickStart) {
        dispatch( actions.setStatus(nextKickStart.kickStartWhat) );
      }

      // when ALL kickStarts have completed, we are done!!!
      // ... we have successfully initialized ALL kickStarts
      // ... otherwise we keep going
      //     - even when we are hung with one kickStart that errored
      //       ... because this process is a critical path that must complete
      //       ... there is no subsequent work that will be done in the entire app
      if (!nextKickStart) {
        wrapup();
      }

    }

    // "prime the pump" by setting our status to the FIRST kickStart
    // ... giving user visibility of what is being done
    // ... e.g. 'Waiting for bla bla bla'
    dispatch( actions.setStatus(kickStarts[0].kickStartWhat) );
    
    // asynchronously kick off each each kickStart process
    kickStarts.forEach(kickStart => {
      kickStart({getState, dispatch, fassets})
        .then( () => {
          // console.log(`xx resolving kickstart IN logic processor ... kickStart.${kickStart.kickStartWhat}`);
          kickStartFinished(kickStart);
        })
        .catch( (err) => {
          // console.log(`xx error caught invoking kickStart.${kickStart.kickStartWhat}: `, err);
          kickStartFinished(kickStart, err);
        });
    });

  },

});


// promote all logic modules for this feature
// ... NOTE: individual logic modules are unit tested using the named exports.
export default [
  kickStart,
];
