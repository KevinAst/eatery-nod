import Expo          from 'expo';
import React         from 'react';
import {connect}     from 'react-redux';
import RN            from 'react-native';
import isString      from 'lodash.isstring';
import SplashScreen  from './comp/SplashScreen';
import FatalScreen   from './comp/FatalScreen';
import SignInScreen  from './comp/SignInScreen';
// import ListScreen    from './comp/ListScreen';

/**
 * Our top-level App component that serves as a simple
 * router/navigator, driven by our app-level redux state!
 *
 * NOTE: We use class component to have access to needed life-cycle
 *       methods.
 */
class AppRouter extends React.Component {

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

    // initally promote Expo.AppLoading untill our system resources are available
    // ... because it uses NO yet-to-be-loaded fonts
    if (!p.systemReady)
      return <Expo.AppLoading/>;

    // if our system could NOT initialized, we cannot continue
    // ... systemReady will contain an error msg string on initialization failure
    if (isString(p.systemReady))
      return <FatalScreen msg={p.systemReady}/>;

    // display interactive SignIn, when form is active
    // ?? this is truely NOT needed if we get our act together
    // ?? that means I don't have to maintain deviceCredentials of 'NONE'
    // ??? KEY: this is causing some render() issue when applied
    // ? if (p.deviceCredentials === 'NONE') { // ?? unsure WHY is this needed (if our multiple dispatches operate in succession
    // ?   console.log(`??? ROUTE: SignInScreen 111 (deviceCredentials is NONE) ... deviceCredentials/signInForm: `, p.deviceCredentials, p.signInForm);
    // ?   return <SignInScreen/>;
    // ? }
    // ??? ABOVE WAS CAUSING A RENDER ERROR that WAS NOT REPORTED ... was due to redux-logic swallowing the error!
    if (p.signInForm) {
      return <SignInScreen/>;
    }

    // ??? current working point!

    // return <ListScreen/>; // ?? more logic

    // fallback is our SplashScreen
    console.log(`?? <AppRouter> fallback to SpashScreen ... appState: `, p.appState);
    return <SplashScreen/>;
  }

}

export default connect(
  appState => { // mapStateToProps
    return {
      appState, // ?? very temporary
      systemReady:       appState.systemReady,
   // deviceCredentials: appState.auth.deviceCredentials, // ?? do we need this?
      signInForm:        appState.auth.signInForm,
    };
  })(AppRouter);



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
