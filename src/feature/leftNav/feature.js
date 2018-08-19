import {createFeature}  from 'feature-u';
import name             from './featureName';
import fassets          from './fassets';
import appWillStart     from './appWillStart';


/**
 * The **'leftNav'** feature promotes the app-specific Drawer/SideBar
 * on the app's left side.
 *
 * This feature is app-neutral, as it pulls in it's menu items from
 * external features using the fassets.use 'leftNavItem.*' contract.
 *
 * **Screen Flow**
 *
 * You can see a Screen Flow diagram at: `docs/ScreenFlow.png`.
 */
export default createFeature({
  name,

  fassets,

  appWillStart,
});
