import verify         from '../../../verify';
import isFunction     from 'lodash.isfunction';

const defaultCB = () => null;

/**
 * @function createRoute
 * @description
 *
 * Create a new Route object, that provides a generalized run-time
 * API to abstractly expose component rendering, based on appState.
 *
 * The Route object contains one or two function callbacks (routeCB), with
 * the following signature:
 * ```js
 *   routeCB(app, appState): rendered-component (null for none)
 * ```
 *
 * The routeCB reasons about the supplied appState, and either returns a
 * rendered component, or null to allow downstream routes the same
 * opportunity.  Basically the first non-null return wins.
 *
 * One or two routeCBs can be registered, one with priority and one
 * without.  The priority routeCBs are given precedence across all
 * registered routes before the non-priority routeCBs are invoked, and
 * are useful in some cases to minimize the feature registration
 * order.
 *
 * **Aspect Configuration** ... see User Guide for details
 *
 * 1. fallbackElm (REQUIRED): the fallback elm representing a
 *    SplashScreen (of sorts) when no routes are in effect.
 *
 * 2. componentWillUpdateHook (OPTIONAL): invoked in
 *    componentWillUpdate() life-cycle hook.  Initially developed to
 *    support ReactNative animation.
 *
 * **Please Note**: `createRoute()` accepts named parameters.
 *
 * @param {routeCB} [content] the non-priority route routeCB (if any)
 * ... see: desc above.
 *
 * @param {routeCB} [priorityContent] the priority route routeCB (if
 * any) ... see: desc above.
 *
 * @return {Route} a new Route object.
 */
export default function createRoute({content=defaultCB,
                                     priorityContent=defaultCB,
                                     ...unknownArgs}={}) {

  // ***
  // *** validate parameters
  // ***

  const check = verify.prefix('createRoute() parameter violation: ');

  check(isFunction(content),         'content (when supplied) must be a function');
  check(isFunction(priorityContent), 'priorityContent (when supplied) must be a function');

  const unknownArgKeys = Object.keys(unknownArgs);
  check(unknownArgKeys.length===0,  `unrecognized named parameter(s): ${unknownArgKeys}`);

  check(!(content===defaultCB && priorityContent===defaultCB), 'at least one routeCB must be supplied (either content or priorityContent)');


  // ***
  // *** return a new Route object
  // ***

  return {
    content,
    priorityContent,
  };

}


/**
 * @private
 *
 * Validate the supplied route object.
 *
 * @param {Route} route the Route object to validate.
 *
 * @return {string} an error message (when invalid), null for valid.
 */
export function isValidRoute(route) {

  // consider unsupplied to be valid (hmmm ... OK ... they are optional)
  if (!route)
    return null;

  // validate the supplie route
  const errors = [];
  const props  = Object.keys(route);
  props.forEach( prop => {
    if (prop==='content' || prop==='priorityContent') {
      // only content()/priorityContent() must be functions
      if (!isFunction(route[prop])) {
        errors.push(`${prop} must be a function`);
      }
    }
    // only content()/priorityContent() is allowed
    else {
      errors.push(`Unknown property: ${prop}`);
    }
  });

  // must have at least one method
  if (props.length === 0) {
    errors.push('Must have at least one method ... content() or priorityContent()');
  }

  // that's all folks
  return errors.length===0 ? null : `route has the following error(s): ${errors}`;
}


//***
//*** Specification: routeCB
//***

/**
 * A functional callback hook (specified in createRoute()) that
 * reasons about the supplied appState, and either returns a rendered
 * component screen, or null to allow downstream routes the same
 * opportunity.
 * 
 * Basically the first non-null return (within all registered
 * routeCBs) wins.
 *
 * One or two routeCBs can be registered (through createRoute()), one
 * with priority and one without.  The priority routeCBs are given
 * precedence across all registered routes before the non-priority
 * routeCBs are invoked, and are useful in some cases to minimize the
 * feature registration order.
 *
 * @callback routeCB
 *
 * @param {App} app the App object used in feature cross-communication.
 * 
 * @param {Any} appState - the top-level application state.
 *
 * @return {reactElm} a rendered component (i.e. react element)
 * representing the screen to display, or null for none (allowing
 * downstream routes an opportunity).
 */
