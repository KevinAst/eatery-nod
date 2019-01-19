import React        from 'react';
import PropTypes    from 'prop-types';
import {Linking}    from 'react-native';
import withState    from '../../../../util/withState';
import {Body,
        Button,
        Container,
        Content,
        Form,
        Footer,
        FooterTab,
        Header,
        Icon,
        Left,
        Right,
        Text,
        Title,
        View}       from 'native-base';
import commonStyles from '../../commonStyles';
import actions      from '../actions';


/**
 * EateryDetailScreen displaying the details of a given eatery.
 */
function EateryDetailScreen({eatery, handleClose, handleSpin}) {

  const verticalSpacing = (spacing=10) => <View style={{paddingVertical: spacing}}/>;

  return (
    <Container style={commonStyles.container}>
      <Header>
        <Left>
          <Button transparent onPress={handleClose}>
            <Icon name="arrow-back"/>
          </Button>
        </Left>
        <Body>
          <Title>Eatery</Title>
        </Body>
        <Right/>
      </Header>
      <Content style={{padding: 10}}>

        <Form>

          {verticalSpacing()}
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            {eatery.name}
          </Text>

          {/* Address and Navigation */}
          {verticalSpacing()}
          <Button transparent
                  onPress={()=>Linking.openURL(eatery.navUrl)}>
            <Icon name="navigate"/>
            <Text>{eatery.addr}</Text>
          </Button>


          {/* Phone and Dialer */}
          {verticalSpacing()}
          <Button transparent
                  onPress={()=>Linking.openURL(`tel:${eatery.phone}`)}>
            <Icon name="call"/>
            <Text>{eatery.phone}</Text>
          </Button>

          {/* Website and Launcher */}
          {verticalSpacing()}
          <Button transparent
                  onPress={()=>Linking.openURL(eatery.website)}>
            <Icon name="link"/>
            <Text>Website</Text>
          </Button>

        </Form>

      </Content>
      <Footer>
        <FooterTab>
          <Button vertical
                  onPress={handleSpin}>
            <Icon style={commonStyles.icon} name="color-wand"/>
            <Text style={commonStyles.icon}>Spin Again</Text>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
}


EateryDetailScreen.propTypes = {
  eatery: PropTypes.object.isRequired,
};

export default EateryDetailScreenWithState = withState({
  component: EateryDetailScreen,
  mapDispatchToProps(dispatch) {
    return {
      handleClose() {
        dispatch( actions.viewDetail.close() );
      },
      handleSpin() {
        dispatch( actions.spin() );
      },
    };
  },
});
