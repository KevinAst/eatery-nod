import isFunction  from 'lodash.isfunction';
import isString    from 'lodash.isstring';
import verify      from '../../../../util/verify';

/**
 * Embellish the supplied function with a `kickStartWhat` property -
 * used by the `device` feature to set the device status.
 *
 * A kickStart function is used by the `device` feature, as part of
 * it's 'kickStart.*' fassets use contract.
 * 
 * @param {string} what - a description of what is being kick started
 * (e.g. 'Waiting for bla bla bla').
 * 
 * @param {function} fn - the function to be embellished with the
 * `kickStartWhat` property.  The API of this function is:
 *   + fn({getState, dispatch, fassets})): promise - void (for error handling)
 *
 * @return {function} the supplied fn parameter, embellished with a
 * `kickStartWhat` property.
 */
export function createKickStart(what, fn) {

  // validate parameters
  const check = verify.prefix('createKickStart() parameter violation: ');

  check(what,           'what is required');
  check(isString(what), 'what must be a string');

  check(fn,             'fn is required');
  check(isFunction(fn), 'fn must be a function');

  // embellish/return the supplied function
  fn.kickStartWhat = what;
  return fn;
}


/**
 * Return an indicator as to whether the supplied `ref` parameter is a
 * kickStart function.
 * 
 * @param {any} ref - the reference item to validate.
 *
 * @return {boolean} true: is a kickStart function, false otherwise.
 */
export function isKickStart(ref) {
  return ref && isFunction(ref) && ref.kickStartWhat;
}


/**
 * A kickStart validator conforming to feature-u's fassetValidation
 * API ... see: https://feature-u.js.org/cur/api.html#fassetValidations
 * 
 * @param {any} fassetsValue - the fassets value to validate.
 *
 * @return {string} null: valid kickStart -or-
 * 'kickStart function': NOT a valid kickStart (used in feature-u
 * Error content).
 */
export function isFassetKickStart(fassetsValue) {
  return isKickStart(fassetsValue) ? null : 'kickStart function';
}

