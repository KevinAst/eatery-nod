import Expo              from 'expo';
import React             from 'react';
import {connect}         from 'react-redux';
import RN                from 'react-native';
import Splash            from './Splash';
import SignIn            from './SignIn';
import ListView          from './ListView';

/**
 * A simple top-level router/navigator that is driven by our app-level
 * redux state!
 *
 * NOTE: We use class component to expose life-cycle methods, to
 *       asynchronously load various system resources (like Expo fonts).
 */
class AppScreenRouter extends React.Component {

  // internal indication of whether system resources have been loaded
  state = {
    isReady: false,
  };

  componentWillMount() {
    // async load of resources needed prior to rendering our App
    // ... NativeBase uses these custom fonts
    Expo.Font.loadAsync({
      'Roboto':        require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    })
    .then(() => {
      this.setState({isReady: true});
    });
  }

  componentWillUpdate() {
    // LayoutAnimation has to be done JUST before a state change
    // ... the reason it is done here
    RN.LayoutAnimation.configureNext(appAnimationConfig);
  }

  /**
   * This rendor() method contains our simplistic router/navigator
   * functionality, based on app-level redux state!
   */
  render() {
    const p = this.props;

    // use Expo.AppLoading till our async resources are available
    // ... because it uses NO yet-to-be-loaded fonts
    if (!this.state.isReady)
      return <Expo.AppLoading/>;

    if (!p.appState.user)
      return <SignIn/>;

    return <ListView/>; // ?? more logic

    return <Splash/>; // ?? fallback to something
  }

}

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

export default connect(
  state => { // mapStateToProps
    return {
      appState: state // ?? crude for now
    };
  })(AppScreenRouter);
