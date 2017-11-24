import {connect} from 'react-redux';
import verify    from './verify';

/**
 * 
 * Connect the supplied react component to the redux store, returning
 * a higher-order react component.
 * 
 * This is a slightly improved version of the redux connect()
 * function, because it uses named arguments, making invocations more self
 * documenting.
 * 
 *
 * @param {Component} component the app-specific react component to
 * wrap (i.e. connect).
 * 
 * @param {any} [directive.mapStateToProps]    see redux connect() docs.
 * @param {any} [directive.mapDispatchToProps] see redux connect() docs.
 * @param {any} [directive.mergeProps]         see redux connect() docs.
 * @param {any} [directive.options]            see redux connect() docs.
 *
 * Example:
 * ```
 *   export default connectRedux(MyClass, {
 *     mapStateToProps(appState) {
 *       return {
 *         deviceStatus: appState.device.status,
 *       };
 *     },
 *     mapDispatchToProps(dispatch, ownProps) {
 *       return {
 *         changeView(view) {
 *           dispatch( actions.view.change(view) );
 *           app.leftNav.close();
 *         },
 *         handleFilterDiscovery() {
 *           dispatch( actions.discovery.filter.open() );
 *           app.leftNav.close();
 *         },
 *       };
 *     },
 *   });
 * ```
 */
export default function connectRedux(component,
                                     {mapStateToProps,
                                      mapDispatchToProps,
                                      mergeProps,
                                      options,
                                      ...unknownArgs}) {
  // validate params
  const check = verify.prefix('connectRedux() parameter violation: ');
  check(component, 'component is required');

  const unknownArgKeys = Object.keys(unknownArgs);
  check(unknownArgKeys.length===0,  `following directive()s are not allowed by confirm: ${unknownArgKeys}`);
  check(unknownArgKeys.length===0,  `unrecognized directive(s): ${unknownArgKeys}`);

  // defer the the real redux connect, returning the higher-order react component
  return connect(mapStateToProps, mapDispatchToProps, mergeProps, options)(component);
}
