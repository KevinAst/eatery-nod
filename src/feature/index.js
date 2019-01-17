import device      from './device';
import auth        from './auth';
import init        from './init';
import views       from './views';
import services    from './services';
import logActions  from './logActions';
import sandbox     from './sandbox';

/**
 * The **eatery-nod** application is composed of the following **features**:
 *
 * - **device**:       initializes the device for use by the app, and promotes a **device api** abstraction ?? OBSOLETE
 * - **auth**:         promotes complete user authentication ?? move to init
 * - **init**:         a categorized collection of **"Initialization Related"** features
 * - **views**:        a categorized collection of **"UI Related"** features
 * - **services**:     a categorized collection of **"Service Related"** features _(some of which are "mockable")_
 * - **logActions**:   logs all dispatched actions and resulting state
 * - **sandbox**:      promotes a variety of interactive tests, used in development, that can easily be disabled
 */
export default [
  device,
  auth,
  ...init,
  ...views,
  ...services,
  logActions,
  sandbox,
];
