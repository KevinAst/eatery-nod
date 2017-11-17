import React                 from 'react';
import RN                    from 'react-native';
import PropTypes             from 'prop-types';
import connectRedux          from '../connectRedux';
import SplashScreen          from '../comp/SplashScreen';

// ?? obsolete imports
//? import Expo                  from 'expo';
//? import SignInScreen          from '../comp/SignInScreen';
//? import SignInVerifyScreen    from '../comp/SignInVerifyScreen';
//? import EateriesListScreen    from '../comp/EateriesListScreen';
//? import EateryFilterScreen    from '../comp/EateryFilterScreen';
//? import EateryDetailScreen    from '../comp/EateryDetailScreen';
//? import DiscoveryListScreen   from '../comp/DiscoveryListScreen';
//? import DiscoveryFilterScreen from '../comp/DiscoveryFilterScreen';


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
    
    // ?? OBSOLETE (pull into various features)


    //x DENOTES logic moved into new structure ?? trash this when complete
    //
    //? /* eslint-disable curly */
    //
    //x // promote a simple SplashScreen (with status) until our system is ready
    //x // NOTE: Errors related to system resources are promoted through independent user notifications
    //x if (!p.device.fontsLoaded)   // ... before our fonts are loaded,
    //x   return <Expo.AppLoading/>; //     we must use the Expo spash screen (no dependancy on yet-to-be-loaded fonts)
    //x if (p.device.status !== 'READY')
    //x   return <SplashScreen msg={p.device.status}/>;
    //x 
    //x // primary route logic, based on user authorization
    //x switch (p.userStatus) {
    //x 
    //x   // user is: signed in BUT email verification in-progress
    //x   case 'signedInUnverified':
    //x     return <SignInVerifyScreen/> // screen requesting email verification completion
    //x 
    //x   // user is: fully signed in (authorized/verified/profiled)
    //x   // ... this is our real app screens (after authorization)
    //x   case 'signedIn':
    //x 
    //?     if (p.appState.discovery.filterForm) { // ... kinda unexpected: isolated from other Discovery feature (how would this work in "pods" concept?
    //?       return <DiscoveryFilterScreen/>;
    //?     }
    //?     else if (p.appState.eateries.listView.filterForm) { // ... kinda unexpected: isolated from other Eatery feature (how would this work in "pods" concept?
    //?       return <EateryFilterScreen/>;
    //?     }
    //?     else if (p.appState.view === 'eateries') {
    //?       if (p.appState.eateries.spin) {
    //?         return <SplashScreen msg={p.appState.eateries.spin}/>;
    //?       }
    //?       else if (p.appState.eateries.detailView) {
    //?         const eatery = p.appState.eateries.dbPool[p.appState.eateries.detailView];
    //?         return <EateryDetailScreen eatery={eatery}/>;
    //?       }
    //?       else {
    //?         return <EateriesListScreen/>;
    //?       }
    //?     }
    //?     else if (p.appState.view === 'discovery') {
    //?       return <DiscoveryListScreen/>;
    //?     }
    //x 
    //x   // user is: unauthorized (either explicit or status unknown)
    //x   case 'signedOut':
    //x   default:
    //x     // display interactive SignIn, when form is active
    //x     if (p.signInForm) {
    //x       return <SignInScreen/>;
    //x     }
    //x     // ?? check for signUpForm
    //x }
    //x 
    //x // fallback is our SplashScreen
    //x return <SplashScreen msg="Router Fallback"/>;

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
      // ?? obsolete
      //? device:       appState.device,
      //? userStatus:   appState.auth.user.status,
      //? signInForm:   appState.auth.signInForm,
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
