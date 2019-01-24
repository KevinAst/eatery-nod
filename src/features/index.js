import init        from './init';
import views       from './views';
import services    from './services';
import support     from './support';
import diag        from './diag';

/**
 * The **eatery-nod** application is composed of the following **features**:
 *
 * - **init**:         a collection of **"Initialization Related"** features
 * - **views**:        a collection of **"UI Related"** features
 * - **services**:     a collection of **"Service Related"** features _(some of which are "mockable")_
 * - **support**:      a collection of **"Support Utility"** features
 * - **diag**:         a collection of **"Diagnostic Related"** features
 */
export default [
  ...init,
  ...views,
  ...services,
  ...support,
  ...diag,
];
