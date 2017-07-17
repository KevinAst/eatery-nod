import React        from 'react';
import {connect}    from 'react-redux';
import PropTypes    from 'prop-types';
import {Body,
        Button,
        Container,
        Content,
        Footer,
        FooterTab,
        Form,
        Header,
        Icon,
        Left,
        Right,
        Text,
        Title}        from 'native-base';
import commonStyles   from './commonStyles';
import actions        from '../actions';
import signInFormMeta from '../logic/signInFormMeta';
import ITextField     from '../util/iForms/comp/ITextField';


/**
 * SignInScreen: gather user sign-in credentials.
 */
function SignInScreen({signInForm}) {

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
       <Form>
        <Text>Sign in please!</Text>

        <ITextField fieldName="email"
                    iForm={signInForm}
                    placeholder="jon.snow@gmail.com"
                    keyboardType="email-address"/>

        <ITextField fieldName="pass"
                    iForm={signInForm}
                    secureTextEntry/>

        <Button light rounded onPress={signInForm.handleProcess}>
          <Text>Sign In</Text>
        </Button>
       </Form>
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

SignInScreen.propTypes = {
  signInForm: PropTypes.object.isRequired,
};

export default connect(

  // mapStateToProps()
  (appState) => {
    return {
      formState: signInFormMeta.selectFormState(appState),
    };
  },

  // mapDispatchToProps()
  null,

  // mergeProps()
  (stateProps, dispatchProps, ownProps) => {
    return {
      ...ownProps,
    //...stateProps,    // unneeded (in this case) ... wonder: does this impact connect() optimization?
    //...dispatchProps, // ditto
      signInForm: signInFormMeta.IForm(stateProps.formState, 
                                       actions.auth.interactiveSignIn,
                                       dispatchProps.dispatch),
    };
  }
)(SignInScreen);