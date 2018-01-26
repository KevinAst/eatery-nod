import React      from 'react';       // ?? peerDependencies
import {connect}  from 'react-redux'; // ?? peerDependencies

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

  constructor(props) {
    super(props);
    // console.log(`xx constructing StateRouter ONLY ONCE .. here are my props: `, Object.keys(this.props));

    // re-order our routes in their execution order
    const routes = this.props.routes;
    // ... retain the original routes order (for sort tie breaker within same routePriority)
    routes.forEach( (route, indx) => route.originalOrder = indx );
    // ... sort by execution order
    routes.sort( (r1, r2) => (
      r2.routePriority - r1.routePriority || // ... FIRST:  routePriority (decending)
      r1.originalOrder - r2.originalOrder    // ... SECOND: registration order (ascending)
    ));
    // console.log('xx StateRouter route order:')
    // routes.forEach( (route, indx) => console.log(`xx   ${indx+1}: ${route.featureName}: ${route.routePriority}`) );
  }

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

    const {routes, appState, fallbackElm, namedDependencies} = this.props;

    // apply routes in order of 1: routePriority, 2: registration order (within same priority)
    for (const route of routes) {
      const content = route({appState, ...namedDependencies});
      if (content)
        return content;
    }

    // fallback
    return fallbackElm;
  }
}

// NOTE: Because we are invoked within our controlled env, we bypass
//       prop-types npm pkg, and assume our props are correct!  This
//       eliminates the need for prop-types peerDependencies (or
//       dependency).
// import PropTypes from 'prop-types';
// StateRouter.propTypes = {
//   routes:      PropTypes.array.isRequired,   // all registered routes: routeCB[]
//   appState:    PropTypes.object.isRequired,  // appState, from which to reason about routes
//   fallbackElm: PropTypes.element.isRequired, // fallback elm representing a SplashScreen (of sorts) when no routes are in effect
//   componentWillUpdateHook: PropTypes.func    // OPTIONAL: invoked in componentWillUpdate() life-cycle hook (initially developed to support ReactNative animation)
//   namedDependencies: PropTypes.object        // OPTIONAL: object containing named dependencies to be injected into to routeCB() function call ... ex: <StateRouter namedDependencies={{app, api}}/>
// };

// access redux appState, via redux connect()
export default connect( (appState) => ({appState}))(StateRouter);
