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
        Title,
        View}        from 'native-base';
import commonStyles   from './commonStyles';
import signInFormMeta from '../logic/iForms/signInFormMeta';
import ITextField     from '../util/iForms/comp/ITextField';


/**
 * SignInScreen: gather user sign-in credentials.
 */
function SignInScreen({signInForm}) {

  const verticalSpacing = <View style={{paddingVertical: 10}}/>;

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
      <Content keyboardShouldPersistTaps="handled">
       <Form>

         {verticalSpacing}

         <Text>Welcome to eatery-nod, please {signInForm.getLabel()}!</Text>

         {verticalSpacing}

         <ITextField fieldName="email"
                     iForm={signInForm}
                     placeholder="jon.snow@gmail.com"
                     keyboardType="email-address"/>

         <ITextField fieldName="pass"
                     iForm={signInForm}
                     secureTextEntry/>

         {verticalSpacing}

         {/* form msg  */}
         <Text style={{color:'red'}}>{signInForm.getMsg()}</Text>

         <Button success full onPress={signInForm.handleProcess}>
           <Text>{signInForm.getLabel()}</Text>
         </Button>

         {verticalSpacing}

         <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
           <Text>... don't have an account?</Text>
           <Button light>
             <Text>Sign Up</Text>
           </Button>
         </View>


        {/* inProcess spinner  */}
        {signInForm.inProcess() && <Spinner color="blue"/>}

       </Form>
      </Content>
      <Footer>
        <FooterTab>
          <Button full>
            <Title>{signInForm.getLabel()} Footer</Title>
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
