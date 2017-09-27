import {toast, alert} from './notify';

/**
 * The handleUnexpectedError() function provides a common utility to
 * consistently report/log client-side errors in a standard way.
 * 
 *  - The errors are logged appropriately.
 *  - The user is informed through a simplified notification, 
 *    with a link that provides more detail.
 *
 * @param {Error} err the error that is to be reported/logged.
 */
export default function handleUnexpectedError(err) {

  // err may optionally have additional information in it
  const attemptingTo = err.attemptingToMsg ? `... ${err.attemptingToMsg}` : '';

  // stale data is NOT unexpected ... guide the user more delicately
  if (err.message && err.message.includes('Stale data detected')) { // TODO: retrofit for new environment

    // log the details of the error (with traceback) for tech review
    const userMsg = `Your data is "out of date" ${attemptingTo}`;
    // console.error(userMsg, err); // NO LIKEY in react-native (appears on device in "red screen of death")
    
    // notify user
    toast.warn({
      msg: 'Your data is "out of date" ... refresh and try again.',
      actions: [
        { txt: 'details',
          action: () => {
            toast.warn({ 
              duration: 0, // forces an OK closure
              msg:      `${userMsg}

Someone has modified it since you last retrieved it.

Please refresh the data and try your operation again.`
            })
          },
        },
      ]
    });
  }

  // an unexpected error
  else {

    // log the details of the error (with traceback) for tech review
    const userMsg = `An unexpected error occurred ${attemptingTo}`;
    // console.error(userMsg, err); // NO LIKEY in react-native (appears on device in "red screen of death")
    
    // notify user
    alert.error({
      msg: userMsg,
      actions: [
        { txt: 'details',
          action: () => {
            alert.error({ 
              msg:      `${userMsg}

${err}

If this problem persists, please contact your tech support.`
            })
          },
        },
      ]
    });
  }
}
