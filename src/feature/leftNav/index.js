import {createFeature}  from '../../util/feature-u';
import publicAPI        from './publicAPI';
import appWillStart     from './appWillStart';

/**
 * The 'leftNav' feature introduces the app-specific Drawer/SideBar 
 * on the left-hand side of our app.
 *
 * ?? This feature is app-specific, as it has knowledge of the various
 * features that make up our app.
 *
 * ?? In general, the leftNav menu activates various features of our app, and is therefore ??what-I-said-above
 */
export default createFeature({
  name: 'leftNav',

  publicAPI,

  appWillStart,
});
