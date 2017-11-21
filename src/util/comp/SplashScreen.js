import Expo         from 'expo';
import React        from 'react';
import connectRedux from '../connectRedux';
import {Image}      from 'react-native';
// ?? Button is: VERY TEMP
import {Body,
        Button,
        Container,
        Content,
        Header,
        Left,
        Right,
        Spinner,
        Text,
        Title}      from 'native-base';
import PropTypes    from 'prop-types';
import app          from '../../app';
import commonStyles from '../../feature/commonStyles';


/**
 * SplashScreen used when there is nothing else to display.
 */
function SplashScreen({msg, fontsLoaded}) {

  // fallback to <Expo.AppLoading/> when fonts have not yet been loaded
  // ... because <Text> uses native-base fonts
  if (!fontsLoaded) {
    // console.log('xx <SplashScreen> FONTS NOT LOADED: fallback to <Expo.AppLoading>');
    return <Expo.AppLoading/>;
  }

  return (
    <Container style={commonStyles.container}>
      <Header>
        <Left/>
        <Body>
          <Title>Eatery Nod</Title>
        </Body>
        <Right/>
      </Header>
      <Content contentContainerStyle={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
        <Image style={{width: 100, height: 100}}
               source={require("../../../assets/icons/eatery.png")}/>
        <Spinner color="blue"/>
        <Text>{msg}</Text>
        {/* ??? VERY TEMP */}
        <Button transparent
                onPress={app.leftNav.api.open}>
          <Text>TEMPORARY left-nav</Text>
        </Button>

      </Content>
    </Container>
  );
}

SplashScreen.propTypes = {
  msg: PropTypes.string,
};

SplashScreen.defaultProps = {
  msg: '',
};


export default connectRedux(SplashScreen, {
  mapStateToProps(appState) {
    return {
      // hmmm ... inappropriate coupling: common component <SplashScreen> using app-specific info
      fontsLoaded: app.startup.sel.areFontsLoaded(appState),
    };
  },
});
