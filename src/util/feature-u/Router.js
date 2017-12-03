import React                 from 'react';
import RN                    from 'react-native';
import PropTypes             from 'prop-types';
import connectRedux          from '../connectRedux';
import SplashScreen          from '../comp/SplashScreen';

/**
 * Our top-level App component that serves as a simple
 * router/navigator, driven by our app-level redux state!
 *
 * NOTE: We use class component in order to provide animation
 *       (controlled through component life-cycle events).
 */
class Router extends React.Component {

  componentWillUpdate() {
    // LayoutAnimation has to be injected JUST before a state change
    // ... the reason it is done here
    RN.LayoutAnimation.configureNext(appAnimationConfig);
  }

  /**
   * Our rendor() method implements our router/navigation, based
   * on simple app-level redux state!
   */
  render() {

    const {app, routes, appState} = this.props;

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

    // fallback to a SplashScreen
    return <SplashScreen msg="I'm trying to think but it hurts!"/>;
  }
}

Router.propTypes = {
  app:      PropTypes.object.isRequired,
  routes:   PropTypes.array.isRequired,
  appState: PropTypes.object.isRequired,
};

export default connectRedux(Router, {
  mapStateToProps(appState) {
    return {
      appState,
    };
  },
});


// define our own animation characteristics (very close to spring)
// NOTE: LayoutAnimation.Presets options include: easeInEaseOut, linear, spring
//       ex: LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
// NOTE: For more info, see:
//       - doc:
//         https://facebook.github.io/react-native/docs/layoutanimation.html
//       - article: 
//         https://medium.com/@Jpoliachik/react-native-s-layoutanimation-is-awesome-4a4d317afd3e
//       - code: 
//         https://github.com/facebook/react-native/blob/master/Libraries/LayoutAnimation/LayoutAnimation.js
const appAnimationConfig = { // modified LayoutAnimation.Presets.spring
  duration:        500, // WAS: 700 (tone it down just a bit)
  create: {
    type:          RN.LayoutAnimation.Types.linear,
    property:      RN.LayoutAnimation.Properties.opacity,
  },
  update: {
    type:          RN.LayoutAnimation.Types.spring,
    springDamping: 0.4,
  },
  delete: {
    type:          RN.LayoutAnimation.Types.linear,
    property:      RN.LayoutAnimation.Properties.opacity,
  },
};
