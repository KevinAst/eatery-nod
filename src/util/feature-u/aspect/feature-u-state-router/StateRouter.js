import React      from 'react';       // ?? peerDependancies
import {connect}  from 'react-redux'; // ?? peerDependiences

/**
 * A top-level React component that serves as a simple router, driven
 * by our app-level redux state!  This component must be injected in
 * the root of your application DOM element.
 *
 * NOTE: We use React class in order to tap into it's life-cycle
 *       hooks, used by the optional componentWillUpdateHook property
 *       (initially developed to support ReactNative animation).
 */
class StateRouter extends React.Component {

  componentWillUpdate() {
    // optionally invoke the componentWillUpdateHook (when specified)
    // ... initially developed to support ReactNative animation
    if (this.props.componentWillUpdateHook) {
      this.props.componentWillUpdateHook();
    }
  }

  /**
   * Our rendor() method implements our router/navigation, based
   * on simple app-level redux state!
   */
  render() {

    const {app, routes, appState, fallbackElm} = this.props;

    // apply priority routes (if any)
    for (const route of routes) {
      const content = route.priorityContent(app, appState);
      if (content)
        return content;
    }

    // apply non-priority routes (if any)
    for (const route of routes) {
      const content = route.content(app, appState);
      if (content)
        return content;
    }

    // fallback
    return fallbackElm;
  }
}

// NOTE: Because we are invoked within our controlled env, we bypass
//       prop-types npm pkg, and assume our props are correct!  This
//       eliminates the need for prop-types peerDependancies (or
//       dependency).
// import PropTypes from 'prop-types';
// StateRouter.propTypes = {
//                                              // NOTE: the app injecttion makes the StateRouter dependent on feature-u
//                                              //       ... so it could not live on it's own (as is)
//   app:         PropTypes.object.isRequired,  // feature-u app object (facilitating cross-feature communication)
//   routes:      PropTypes.array.isRequired,   // all app routes accumulated by feature
//   appState:    PropTypes.object.isRequired,  // appState, from which to reason about routes
//   fallbackElm: PropTypes.element.isRequired, // fallback elm representing a SplashScreen (of sorts) when no routes are in effect
//   componentWillUpdateHook: PropTypes.func    // OPTIONAL: invoked in componentWillUpdate() life-cycle hook (initially developed to support ReactNative animation)
// };

// access redux appState, via redux connect()
export default connect( (appState) => ({appState}))(StateRouter);
