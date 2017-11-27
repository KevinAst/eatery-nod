import {createFeature}  from '../../util/feature-u';
import publicAPI        from './publicAPI';
import appWillStart     from './appWillStart';

/**
 * The **'leftNav'** feature promotes the app-specific Drawer/SideBar
 * on the app's left side.
 *
 * This feature is app-specific, as it has knowledge of the various items
 * that make up the app ... coupled through feature cross-communication.
 * In general, it merely activates other features of the app.
 */
export default createFeature({
  name: 'leftNav',

  publicAPI,

  appWillStart,
});
