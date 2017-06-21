import Expo      from 'expo';
import React     from 'react';
import {connect} from 'react-redux';
import SignIn    from './SignIn';
import ListView  from './ListView';

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

  render() {
    const p = this.props;

    // here is our simple router functionality
    if (!this.state.isReady)    return <Expo.AppLoading/>; // initially use AppLoading till our async resources are available
    if (!p.appState.user)       return <SignIn/>;

    return <ListView/>; // ?? more

    return <Splash/>; // fallback to something
  }

}

export default connect(
  state => { // mapStateToProps
    return {
      appState: state // ?? crude for now
    };
  })(AppScreenRouter);
