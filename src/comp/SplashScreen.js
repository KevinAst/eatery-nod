import React        from 'react';
import {Image}      from 'react-native';
import {Body,
        Container,
        Content,
        Header,
        Spinner,
        Title}      from 'native-base';
import commonStyles from './commonStyles';

/**
 * SplashScreen used when there is nothing else to display.
 *
 * NOTE: Because this screen contains text which uses native-base
 *       fonts, it cannot be displayed on initial entry.  In this
 *       case use the <Expo.AppLoading/> component.
 */
export default function SplashScreen() {
  return (
    <Container style={commonStyles.container}>
      <Header>
        <Body>
          <Title>Eatery Nod</Title>
        </Body>
      </Header>
      <Content contentContainerStyle={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
        <Image style={{width: 100, height: 100}}
               source={require("../../assets/icons/eatery.png")}/>
        <Spinner color="blue"/>
      </Content>
    </Container>
  );
}
