import React        from 'react';
import {Image}      from 'react-native';
import {Body,
        Container,
        Content,
        Header,
        Left,
        Right,
        Spinner,
        Text,
        Title}      from 'native-base';
import PropTypes    from 'prop-types';
import commonStyles from './commonStyles';

/**
 * SplashScreen used when there is nothing else to display.
 *
 * NOTE: Because this screen contains text which uses native-base
 *       fonts, it cannot be displayed on initial entry.  In this
 *       case use the <Expo.AppLoading/> component.
 */
export default function SplashScreen({msg}) {
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
               source={require("../../assets/icons/eatery.png")}/>
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
