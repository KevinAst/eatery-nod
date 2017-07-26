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
        View}         from 'native-base';
import commonStyles   from './commonStyles';
import signInFormMeta from '../logic/iForms/signInFormMeta';
import ITextField     from '../util/iForms/comp/ITextField';


/**
 * SignInScreen: gather user sign-in credentials.
 */
function SignInScreen({iForm}) {

  const verticalSpacing = <View style={{paddingVertical: 10}}/>;

  const formLabel     = iForm.getLabel();
  const formInProcess = iForm.inProcess();

  return (
    <Container style={commonStyles.container}>
      <Header>
        <Left>
          <Button transparent>
            <Icon name="menu"/>
          </Button>
        </Left>
        <Body>
          <Title>{formLabel}</Title>
        </Body>
        <Right/>
      </Header>
      <Content keyboardShouldPersistTaps="handled">
       <Form>

         {verticalSpacing}

         <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
           <Text>Welcome to eatery-nod, please {formLabel}!</Text>
         </View>

         {verticalSpacing}

         <ITextField fieldName="email"
                     iForm={iForm}
                     placeholder="jon.snow@gmail.com"
                     keyboardType="email-address"
                     editable={!formInProcess}/>

         <ITextField fieldName="pass"
                     iForm={iForm}
                     secureTextEntry
                     editable={!formInProcess}/>

         {verticalSpacing}

         {/* form msg  */}
         <Text style={{color:'red'}}>{iForm.getMsg()}</Text>

         <Button success full onPress={iForm.handleProcess} disabled={formInProcess}>
           <Text>{formLabel}</Text>
         </Button>

         {verticalSpacing}

         <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
           <Text>  ... don&apos;t have an account?  </Text>
           <Button light disabled={formInProcess}>
             <Text>Sign Up</Text>
           </Button>
         </View>


        {/* inProcess spinner  */}
        {formInProcess && <Spinner color="blue"/>}

       </Form>
      </Content>
      <Footer>
        <FooterTab>
          <Button full>
            <Title>{formLabel} Footer</Title>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
}

SignInScreen.propTypes = {
  iForm: PropTypes.object.isRequired,
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
      iForm: signInFormMeta.IForm(stateProps.formState, 
                                  dispatchProps.dispatch),
    };
  }
)(SignInScreen);
