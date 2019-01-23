import logActions  from './logActions';
import sandbox     from './sandbox';

/**
 * The **diag** directory is a collection of
 * **"Diagnostic Related"** features.
 * 
 *  - **logActions**: logs all dispatched actions and resulting state
 *  - **sandbox**:    promotes a variety of interactive tests, used in development, that can easily be disabled
 */
export default [
  logActions,
  sandbox,
];
