import React      from 'react';
// import actions    from '../actions'; ?? not defined yet
// import Alert      from '../comp/Alert'; ?? NO NO NO


/**
 * The handleUnexpectedError() function provides a common utility to
 * consistently report/log client-side errors in a standard way.
 * 
 *  - The supplied err is appropriately logged.
 *
 *  - A redux action is created/returned that will provide appropriate
 *    communication to the user in a standardized way (with an
 *    optional details link to glean additional 'technical'
 *    information).
 *
 * NOTE: The returned action MUST BE dispatched (through the redux store)
 *       in order for the user to visualize the error condition.
 *
 * @param {Error} err the error that is to be reported/logged.
 *
 * @return {Action} a redux action object that MUST BE dispatched to
 * report the error to the user.
 */
export default function handleUnexpectedError(err) {

  const attemptingTo = err.attemptingToMsg ? `... ${err.attemptingToMsg}` : '';

  // stale data is NOT unexpected ... guide the user more delicately
  if (err.message.includes('Stale data detected')) { // ?? RETROFIT

    // log the details of the error (with traceback) for tech review
    const userMsg = `Your data is "out of date" ${attemptingTo}`;
    console.error(userMsg, err); // ?? temp ... BAD: console.error() shows on device in "red screen of death"
    
    // create/return action providing user communication
    return { type: 'ERROR', err }; // ?? TEMP ... RETROFIT
// ?    return actions.userMsg.display('Your data is "out of date" ... refresh and try again.',
// ?                                   {
// ?                                     txt:      'details',
// ?                                     callback: () => { // display more detail to user
// ?                                       Alert.display({
// ?                                         title: 'Stale Data',
// ?                                         msg:   <div>
// ?  {userMsg}
// ?  <br/><br/>
// ?  Someone has modified it since you last retrieved it.
// ?  <br/><br/>
// ?  Please refresh the data and try your operation again.
// ?                                         </div>
// ?                                       });
// ?                                     }
// ?                                   });
  }

  // an unexpected error
  else {

    // log the details of the error (with traceback) for tech review
    const userMsg = `An unexpected error occurred ${attemptingTo}`;
    console.error(userMsg, err); // ?? temp ... BAD: console.error() shows on device in "red screen of death"
    
    // create/return action providing user communication
    return { type: 'ERROR', err }; // ?? TEMP ... RETROFIT
// ?     return actions.userMsg.display(userMsg, 
// ?                                    {
// ?                                      txt:      'details',
// ?                                      callback: () => { // display more detail to user
// ?                                        Alert.display({
// ?                                          title: 'Unexpected Error',
// ?                                          // NOTE: err.message (below) containd applicable server logId (if any) to report to tech support
// ?                                          msg:   <div>
// ?                                            {userMsg}
// ?                                            <ul>
// ?                                              {err.clientMsg}<br/>
// ?                                          {err.message}
// ?                                            </ul>
// ?                                            If this problem persists, please contact your tech support.
// ?                                          </div>
// ?                                        });
// ?                                      }
// ?                                    });
  }
}
