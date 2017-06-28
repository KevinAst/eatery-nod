import React        from 'react';
import {connect}    from 'react-redux';
import {Body,
        Button,
        Container,
        Content,
        Footer,
        FooterTab,
        Header,
        Icon,
        Input,
        Left,
        Right,
        Text,
        Title}      from 'native-base';
import commonStyles from './commonStyles';

/**
 * SignInScreen, managing sign-in credentials.
 */
function SignInScreen(p) {
  return (
    <Container style={commonStyles.container}>
      <Header>
        <Left>
          <Button transparent>
            <Icon name="menu"/>
          </Button>
        </Left>
        <Body>
          <Title>Sign In</Title>
        </Body>
        <Right/>
      </Header>
      <Content>
        <Text>Sign in please!</Text>
{/*?? */}
        <Input placeholder="Email"
               value={p.email}/>

        <Button light rounded onPress={p.signedIn}>
          <Text>Sign In</Text>
        </Button>
      </Content>
      <Footer>
        <FooterTab>
          <Button full>
            <Title>Sign In Footer</Title>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
}

export default connect(
  appState => {    // mapStateToProps
    return {
      email: appState.auth.signInForm.email,
    };
  },
  dispatch => { // mapDispatchToProps
    return {
      signedIn: () => dispatch({type: 'do_some_SignIn'}),
    };
  }
)(SignInScreen);
