import Expo                  from 'expo';
import React                 from 'react';
import RN                    from 'react-native';
import isString              from 'lodash.isstring';
import connectRedux          from '../util/connectRedux';
import SplashScreen          from '../comp/SplashScreen';
import SignInScreen          from '../comp/SignInScreen';
import SignInVerifyScreen    from '../comp/SignInVerifyScreen';
import EateriesListScreen    from '../comp/EateriesListScreen';
import EateryFilterScreen    from '../comp/EateryFilterScreen';
import EateryDetailScreen    from '../comp/EateryDetailScreen';
import DiscoveryListScreen   from '../comp/DiscoveryListScreen';
import DiscoveryFilterScreen from '../comp/DiscoveryFilterScreen';


/**
 * Our top-level App component that serves as a simple
 * router/navigator, driven by our app-level redux state!
 *
 * NOTE: We use class component to have access to needed life-cycle
 *       methods.
 */
class ScreenRouter extends React.Component {

  componentWillUpdate() {
    // LayoutAnimation has to be done JUST before a state change
    // ... the reason it is done here
    RN.LayoutAnimation.configureNext(appAnimationConfig);
  }

  /**
   * This rendor() method is essentially our router/navigator, based
   * on simple app-level redux state!
   */
  render() {
    const p = this.props;

    /* eslint-disable curly */

    // promote a simple SpashScreen (with status) until our system is ready
    // NOTE: Errors related to system resources are promoted through independent user notifications
    if (!p.device.fontsLoaded)   // ... before our fonts are loaded,
      return <Expo.AppLoading/>; //     we must use the Expo spash screen (no dependancy on yet-to-be-loaded fonts)
    if (p.device.status !== 'READY')
      return <SplashScreen msg={p.device.status}/>;


    // OLD: display interactive SignIn, when form is active
    // ?? this is truely NOT needed if we get our act together
    // ?? that means I don't have to maintain deviceCredentials of 'NONE'
    // ??? KEY: this is causing some render() issue when applied
    // ? if (p.deviceCredentials === 'NONE') { // ?? unsure WHY is this needed (if our multiple dispatches operate in succession
    // ?   console.log(`??? ROUTE: SignInScreen 111 (deviceCredentials is NONE) ... deviceCredentials/signInForm: `, p.deviceCredentials, p.signInForm);
    // ?   return <SignInScreen/>;
    // ? }
    // ??? ABOVE WAS CAUSING A RENDER ERROR that WAS NOT REPORTED ... was due to redux-logic swallowing the error!

    // primary route logic, based on user authorization
    switch (p.userStatus) {

      // user is: signed in BUT email verification in-progress
      case 'signedInUnverified':
        return <SignInVerifyScreen/> // screen requesting email verification completion

      // user is: fully signed in (authorized/verified/profiled)
      // ... this is our real app screens (after authorization)
      case 'signedIn':

        if (p.appState.discovery.filterForm) { // ... kinda unexpected: isolated from other Discovery feature (how would this work in "pods" concept?
          return <DiscoveryFilterScreen/>;
        }
        else if (p.appState.eateries.listView.filterForm) { // ... kinda unexpected: isolated from other Eatery feature (how would this work in "pods" concept?
          return <EateryFilterScreen/>;
        }
        else if (p.appState.view === 'eateries') {
          if (p.appState.eateries.spin) {
            return <SplashScreen msg={p.appState.eateries.spin}/>;
          }
          else if (p.appState.eateries.detailView) {
            const eatery = p.appState.eateries.dbPool[p.appState.eateries.detailView];
            return <EateryDetailScreen eatery={eatery}/>;
          }
          else {
            return <EateriesListScreen/>;
          }
        }
        else if (p.appState.view === 'discovery') {
          return <DiscoveryListScreen/>;
        }

      // user is: unauthorized (either explicit or status unknown)
      case 'signedOut':
      default:
        // display interactive SignIn, when form is active
        if (p.signInForm) {
          return <SignInScreen/>;
        }
        // ?? check for signUpForm
    }

    // fallback is our SplashScreen
    return <SplashScreen msg="Router Fallback"/>;
  }

}

export default connectRedux(ScreenRouter, {
  mapStateToProps(appState) {
    return {
      appState,     // ?? very temporary
      device:       appState.device,
      userStatus:   appState.auth.user.status,
      signInForm:   appState.auth.signInForm,
   // deviceCredentials: appState.auth.deviceCredentials, // ?? do we need this?
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
