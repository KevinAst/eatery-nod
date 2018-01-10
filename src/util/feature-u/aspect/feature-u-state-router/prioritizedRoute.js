import verify         from '../../../verify';
import isFunction     from 'lodash.isfunction';


/**
 * @typedef {Object} PRIORITY
 *
 * Route priority defined constants.  This is strictly a convenience,
 * as any integer can be used.
 *
 * A route priority is an integer value that specifies the order in
 * which a set of routes (routeCB[]) are executed.  Higher priority
 * routes are given precedence (i.e. executed before lower priority
 * routes). This is useful in minimizing the registration order.
 * 
 * Typically an application can operate with just 2 priorities.  While
 * a priority can be any integer number, for your convenience the
 * following constants are provided:
 *
 * ```js
 * import {PRIORITY} from 'feature-u-state-router';
 * 
 * // usage:
 * PRIORITY.HIGH     // ... 100
 * PRIORITY.STANDARD // ...  50 ... the default (when NOT specified)
 * PRIORITY.LOW      // ...  10
 * ```
 */
export const PRIORITY = {
  HIGH:     100,
  STANDARD:  50, // the default (when not specified)
  LOW:       10,
}


/**
 * @function prioritizedRoute
 * @description
 *
 * Embellish the supplied content with a routePriority property - a
 * specification (interpreted by **StateRouter**) as to the order in
 * which a set of routes (routeCB[]) are executed.
 *
 * A routeCB reasons about the supplied appState, and either returns a
 * rendered component screen, or null to allow downstream routes the
 * same opportunity.  Basically the first non-null return (within all
 * registered routeCBs) wins.
 *
 * Priority is an integer value.  Higher priority routes are given
 * precedence (i.e. executed before lower priority routes). This is
 * useful in minimizing the registration order.
 * 
 * Typically an application can operate with just 2 priorites.  While a
 * priority can be any integer number, for your convenience the
 * following constants are provided:
 *
 * ```js
 * import {PRIORITY} from 'feature-u-state-router';
 * 
 * // usage:
 * PRIORITY.HIGH     // ... 100
 * PRIORITY.STANDARD // ...  50 ... the default (when NOT specified)
 * PRIORITY.LOW      // ...  10
 * ```
 *
 * **Please Note**: `prioritizedRoute()` accepts named parameters.
 *
 * @param {routeCB} content the routeCB to embellish.
 *
 * @param {integer} [priority] the embellished priority (DEFAULT:
 * PRIORITY.STANDARD or 50).
 *
 * @return {routeCB} the supplied content, embellished with a
 * routePriority property.
 */
export default function prioritizedRoute({content,
                                          priority=PRIORITY.STANDARD,
                                          ...unknownArgs}={}) {

  // validate parameters
  const check = verify.prefix('prioritizedRoute() parameter violation: ');

  check(content,             'content is required');
  check(isFunction(content), 'content must be a function');

  check(Number.isInteger(priority), `priority (when supplied) must be an integer ... ${priority}`);

  const unknownArgKeys = Object.keys(unknownArgs);
  check(unknownArgKeys.length===0,  `unrecognized named parameter(s): ${unknownArgKeys}`);

  // embellish/return the supplied content
  content.routePriority = priority;
  return content;
}


//***
//*** Specification: routeCB
//***

/**
 * A functional callback hook (specified by prioritizedRoute()) that
 * provides a generalized run-time API to abstractly expose component
 * rendering, based on appState. 
 * 
 * A routeCB reasons about the supplied appState, and either returns a
 * rendered component screen, or null to allow downstream routes the
 * same opportunity.  Basically the first non-null return (within all
 * registered routeCBs) wins.
 *
 * Priority routes are given precedence in their execution order.
 * In other words, the order in which a set of routes (routeCB[]) are
 * executed are 1: routePriority, 2: registration order.  This is
 * useful in minimizing the registration order.
 *
 * **Please Note**: `routeCB()` accepts named parameters.
 *
 * **Also Note**: `app` is actually injected by the routeAspect using
 * StateRouter's namedDependencies.  However, since feature-u is
 * currently the only interface to StateRouter, we document it as part
 * of the routeCB API.
 *
 * @callback routeCB
 *
 * @param {App} app the App object used in feature cross-communication.
 * 
 * @param {Any} appState - the top-level application state to reason
 * about.
 *
 * @return {reactElm} a rendered component (i.e. react element)
 * representing the screen to display, or null for none (allowing
 * downstream routes an opportunity).
 */
