import verify         from '../verify';
import isFunction     from 'lodash.isfunction';

const defaultCB = () => null;

/**
 * Create a new Route object, that provides a generalized run-time
 * API to abstractly expose component rendering, based on appState.
 *
 * The Route object contains one or two function callbacks (CB), with
 * the following signature:
 * ```
 *   CB(app, appState): rendered-component (null for none)
 * ```
 *
 * The CB reasons about the supplied appState, and either returns a
 * rendered component, or null to allow downstream routes the same
 * opportunity.  Basically the first non-null return wins.
 *
 * As mentioned earlier, one or two CBs can be registered, one with
 * priority and one without.  The priority CBs are given precedence
 * across all registered routes before the non-priority CBs are
 * invoked.
 *
 * @param {CB} [namedArgs.content] the non-priority route CB (if any)
 * ... see: desc above.
 *
 * @param {CB} [namedArgs.priorityContent] the priority route CB (if
 * any) ... see: desc above.
 *
 * @return {Route} a new Route object (to be consumed by feature-u's
 * Router via runApp()).
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


  // ***
  // *** return a new Route object
  // ***

  return {
    content,
    priorityContent,
  };

}


/**
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
