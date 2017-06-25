import React        from 'react';
import {Image}      from 'react-native';
import {Body,
        Container,
        Content,
        Header,
        Icon,
        Text,
        Title}      from 'native-base';
import PropTypes    from 'prop-types';
import commonStyles from './commonStyles';

/**
 * FatalScreen displays a msg to the user, when there is nothing left to do.
 * 
 * L8TR: we should NOT be using any native-base fonts (so it can be
 *       displayed without resources)
 *       ... I thought I would have to replace native-base Title/Text with react-native Text 
 *           HOWEVER the NB seems to be working EVEN prior to font loads ... hmmm
 * 
 * NOTE: Because this screen contains text which uses native-base
 *       fonts, it cannot be displayed on initial entry.  In this
 *       case use the <Expo.AppLoading/> component.
 */
export default function FatalScreen({msg}) {
  return (
    <Container style={commonStyles.container}>
      <Header>
        <Body>
          <Title>Eatery Nod (Error)</Title>
        </Body>
      </Header>
      <Content contentContainerStyle={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
        <Image style={{width: 100, height: 100}}
               source={require('../../assets/icons/eatery.png')}/>
        <Icon name="md-sad"   style={{fontSize: 80, color: 'red'}}/>
        <Text>{msg}</Text>
      </Content>
    </Container>
  );
}

FatalScreen.propTypes = {
  msg: PropTypes.string.isRequired
};

FatalScreen.defaultProps = {
  msg: 'A problem has occurred.'
};
