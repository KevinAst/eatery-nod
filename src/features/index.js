import init        from './init';
import views       from './views';
import services    from './services';
import support     from './support';
import diag        from './diag';

/**
 * The **eatery-nod** application is composed of the following **features**:
 *
 * - **init**:         a categorized collection of **"Initialization Related"** features
 * - **views**:        a categorized collection of **"UI Related"** features
 * - **services**:     a categorized collection of **"Service Related"** features _(some of which are "mockable")_
 * - **support**:      a categorized collection of **"Support Utility"** features
 * - **diag**:         a categorized collection of **"Diagnostic Related"** features
 */
export default [
  ...init,
  ...views,
  ...services,
  ...support,
  ...diag,
];
