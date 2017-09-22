import React        from 'react';
import {connect}    from 'react-redux';
import PropTypes    from 'prop-types';
import {Body,
        Button,
        Container,
        Content,
        Form,
        Icon,
        Header,
        Left,
        Right,
        Spinner,
        Text,
        Title,
        View}                  from 'native-base';
import commonStyles            from './commonStyles';
import discoveryFilterFormMeta from '../logic/iForms/discoveryFilterFormMeta';
import ITextField              from '../util/iForms/comp/ITextField';


/**
 * DiscoveryFilterScreen: gather filter information (selection criteria) 
 * for a discovery retrieval.
 */
function DiscoveryFilterScreen({iForm}) {

  const verticalSpacing = <View style={{paddingVertical: 10}}/>;

  const formLabel     = iForm.getLabel();
  const formInProcess = iForm.inProcess();

  return (
    <Container style={commonStyles.container}>
      <Header>
        <Left>
          <Button transparent onPress={iForm.handleClose}>
            <Icon name="close"/>
          </Button>
        </Left>
        <Body>
          <Title>{formLabel}</Title>
        </Body>
        <Right>
          <Button transparent onPress={iForm.handleProcess} disabled={formInProcess}>
            <Icon name="paper-plane"/>
          </Button>
        </Right>
      </Header>


      <Content keyboardShouldPersistTaps="handled">
        <Form>

          {verticalSpacing}

          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10}}>
            <Text style={{fontStyle: 'italic'}}>filter your discovery with these settings ...</Text>
          </View>

          {verticalSpacing}

          <ITextField fieldName="searchText"
                      iForm={iForm}
                      placeholder="... restaurant or town"
                      keyboardType="default"/>

          <ITextField fieldName="distance"
                      iForm={iForm}
                      placeholder="... enter 1-30"
                      keyboardType="numeric"/>

          {verticalSpacing}

          {/* form msg  */}
          <Text style={{color:'red'}}>{iForm.getMsg()}</Text>

          {verticalSpacing}

          {/* inProcess spinner  */}
          {formInProcess && <Spinner color="blue"/>}

        </Form>
      </Content>
    </Container>
  );
}

DiscoveryFilterScreen.propTypes = {
  iForm: PropTypes.object.isRequired,
};

export default connect(

  // mapStateToProps()
  (appState) => {
    return {
      formState: discoveryFilterFormMeta.formStateSelector(appState),
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
      iForm: discoveryFilterFormMeta.IForm(stateProps.formState, 
                                           dispatchProps.dispatch),
    };
  }

)(DiscoveryFilterScreen);
