import Expo          from 'expo';
import React         from 'react';
import {withFassets} from 'feature-u';
import withState     from '../withState';
import {Image}       from 'react-native';
import {Body,
        Container,
        Content,
        Header,
        Left,
        Right,
        Spinner,
        Text,
        Title}       from 'native-base';
import PropTypes     from 'prop-types';
import commonStyles  from '../../features/views/commonStyles';


/**
 * SplashScreen used when there is nothing else to display.
 */
function SplashScreen({msg, guiReady}) {

  // fallback to more primitive content when GUI is NOT yet initialized
  // ... part of the device feature initialization process
  // ... because <Text> uses native-base fonts
  if (!guiReady) {
    // console.log('xx rendering <SplashScreen> GUI NOT READY: fallback to <Expo.AppLoading>');
    return <Expo.AppLoading/>;
  }

  // console.log('xx rendering <SplashScreen> GUI IS READY: using REAL Content');
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


const SplashScreenWithState = withState({
  mapStateToProps(appState, {fassets}) { // ... fassets available in ownProps (via withFassets() below)
    return {
      // hmmm ... inappropriate coupling: common component <SplashScreen> using app-specific info
      guiReady: fassets.sel.isGuiReady(appState),
    };
  },
})(SplashScreen); // NOTE: test withState() BOTH WAYS

export default SplashScreenWithFassets = withFassets({
  component: SplashScreenWithState,
  mapFassetsToProps: {
    fassets: '.', // ... introduce fassets into props via the '.' keyword
  }
});
