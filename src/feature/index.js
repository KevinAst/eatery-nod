import init        from './init';
import views       from './views';
import services    from './services';
import diag        from './diag';

/**
 * The **eatery-nod** application is composed of the following **features**:
 *
 * - **init**:         a categorized collection of **"Initialization Related"** features
 * - **views**:        a categorized collection of **"UI Related"** features
 * - **services**:     a categorized collection of **"Service Related"** features _(some of which are "mockable")_
 * - **diag**:         a categorized collection of **"Diagnostic Related"** features
 */
export default [
  ...init,
  ...views,
  ...services,
  ...diag,
];
