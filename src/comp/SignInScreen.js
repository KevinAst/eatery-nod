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
        Spinner,
        Text,
        Title}        from 'native-base';
import commonStyles   from './commonStyles';
import signInFormMeta from '../logic/iForms/signInFormMeta';
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
          <Title>{signInForm.getLabel()}</Title>
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

        {/* form msg  */}
        <Text style={{color:'red'}}>{signInForm.getMsg()}</Text>

        {/* inProcess spinner  */}
        {signInForm.inProcess() && <Spinner color="blue"/>}

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
      formState: signInFormMeta.formStateSelector(appState),
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
                                       dispatchProps.dispatch),
    };
  }
)(SignInScreen);
