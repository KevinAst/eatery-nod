import verify         from '../verify';
import isFunction     from 'lodash.isfunction';

const defaultCB = () => null;

/**
 * Create a new RouterCB object, that provides a generalized run-time
 * API to abstractly expose component rendering, based on appState.
 *
 * The functionCB has the following signature:
 * ```
 *   functionCB(app, appState): rendered-component (null for none)
 * ```
 *
 * The logic reasons about the supplied appState, and either returns
 * a rendered component, or null to allow downstream registered
 * routers the same opportunity.  Basically the first non-null return
 * wins.
 *
 * One or two CB functions can be registered, one with priority and
 * one without.  The priority CBs are given precedence across all
 * registered routers before the non-priority CBs are invoked.
 *
 * @param {functionCB} [namedArgs.content] the non-priority router CB
 * (if any) ... see: desc above.
 *
 * @param {functionCB} [namedArgs.priorityContent] the priority router
 * CB (if any) ... see: desc above.
 *
 * @return {RouterCB} a new RouterCB object (to be consumed by
 * feature-u's ScreenRouter via runApp()).
 */
export default function createRouterCB({content=defaultCB,
                                        priorityContent=defaultCB,
                                        ...unknownArgs}={}) {

  // ***
  // *** validate parameters
  // ***

  const check = verify.prefix('createRouterCB() parameter violation: ');

  check(isFunction(content),         'content (when supplied) must be a function');
  check(isFunction(priorityContent), 'priorityContent (when supplied) must be a function');

  const unknownArgKeys = Object.keys(unknownArgs);
  check(unknownArgKeys.length===0,  `unrecognized named parameter(s): ${unknownArgKeys}`);


  // ***
  // *** return a new RouterCB object
  // ***

  return {
    content,
    priorityContent,
  };

}


/**
 * Validate the supplied routerCB object.
 *
 * @param {RouterCB} routerCB the RouterCB object to validate.
 *
 * @return {string} an error message (when invalid), null for valid.
 */
export function isValidRouterCB(routerCB) {

  // consider unsupplied to be valid (hmmm ... OK ... they are optional)
  if (!routerCB)
    return null;

  // validate the supplie routerCB
  const errors = [];
  const props  = Object.keys(routerCB);
  props.forEach( prop => {
    if (prop==='content' || prop==='priorityContent') {
      // only content()/priorityContent() must be functions
      if (!isFunction(routerCB[prop])) {
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
  return errors.length===0 ? null : `routerCB has the following error(s): ${errors}`;
}
