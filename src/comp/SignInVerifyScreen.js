import React        from 'react';
import {connect}    from 'react-redux';
import {Body,
        Button,
        Container,
        Content,
        Form,
        Header,
        Text,
        Title,
        View}       from 'native-base';
import PropTypes    from 'prop-types';
import commonStyles from './commonStyles';
import actions      from '../actions';


/**
 * SignInVerifyScreen requesting email verification completion.
 */
function SignInVerifyScreen({email, checkEmailVerified, resendEmailVerification, signOut}) {
  const verticalSpacing = (spacing=10) => <View style={{paddingVertical: spacing}}/>;

  return (
    <Container style={commonStyles.container}>
      <Header>
        <Body>
          <Title>Eatery Nod - SignIn Verification</Title>
        </Body>
      </Header>
      <Content style={{padding: 10}}>

        <Form>

          {verticalSpacing()}

          <Text>
            Your account email has not yet been verified.
          </Text>

          {verticalSpacing()}

          <Text>
            Please follow the instructions from the email sent to: {email}
          </Text>

          {verticalSpacing}

          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Text>Once completed ... </Text>
            <Button light onPress={checkEmailVerified}>
              <Text>Continue</Text>
            </Button>
          </View>

          {verticalSpacing(40)}

          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Button light onPress={resendEmailVerification}>
              <Text>Resend Email</Text>
            </Button>
          </View>

          {verticalSpacing(40)}

          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Button light onPress={signOut}>
              <Text>Sign Out</Text>
            </Button>
          </View>

        </Form>

      </Content>
      
    </Container>
  );
}

SignInVerifyScreen.propTypes = {
  email:                   PropTypes.string.isRequired,
  checkEmailVerified:      PropTypes.func.isRequired,
  resendEmailVerification: PropTypes.func.isRequired,
  signOut:                 PropTypes.func.isRequired,
};

export default connect(

  // mapStateToProps()
  (appState) => {
    return {
      email: appState.auth.user.email,
    };
  },

  // mapDispatchToProps()
  (dispatch) => {
    return {
      checkEmailVerified() {
        dispatch( actions.auth.signIn.checkEmailVerified() );
      },
      resendEmailVerification() {
        dispatch( actions.auth.signIn.resendEmailVerification() );
      },
      signOut() {
        dispatch( actions.auth.signOut() );
      },
    };
  }

)(SignInVerifyScreen);
