import Expo     from 'expo';
import React    from 'react';
import {Text}   from 'react-native';
import * as nb  from 'native-base';

// NOTE: we use class component to expose life-cycle methods, to asynchronously load fonts needed by Expo
//       ... could not handle in main.js, 
//           because Expo.registerRootComponent(App) invocation is NOT allowed
//           in then clause async callback (for some reason)
export default class App extends React.Component {

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

    // render AppLoading component till our async resources have been loaded
    if (!this.state.isReady) {
      return <Expo.AppLoading/>;
    }

    return (
      // ?? modularize a route component ... Splash/Login/etc
      <nb.Container style={styles.container}>
        <nb.Header>
          <nb.Left>
            <nb.Button transparent>
              <nb.Icon name='menu'/>
            </nb.Button>
          </nb.Left>
          <nb.Body>
            <nb.Title>Eatery Nod</nb.Title>
          </nb.Body>
          <nb.Right/>
        </nb.Header>
        <nb.Content>
          <Text>Main Content Here 123!</Text>
        </nb.Content>
        <nb.Footer>
          <nb.FooterTab>
            <nb.Button full>
              <nb.Title>Footer Here</nb.Title>
            </nb.Button>
          </nb.FooterTab>
        </nb.Footer>
      </nb.Container>
    );
  }

}

const styles = {
  container: {
    paddingTop: 24, // prevent overlay of device NavBar (at least on Android)
  },
};

