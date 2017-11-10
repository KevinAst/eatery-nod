import {createFeature}  from '../../util/feature-u';
import publicAPI        from './publicAPI';
import appWillStart     from './appWillStart';

/**
 * The 'leftNav' feature introduces the app-specific Drawer/SideBar 
 * on the left-hand side of our app.
 */
export default createFeature({
  name: 'leftNav',

  publicAPI,

  appWillStart,
});
