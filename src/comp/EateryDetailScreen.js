import React        from 'react';
import PropTypes    from 'prop-types';
import {connect}    from 'react-redux';
import {TouchableWithoutFeedback} from 'react-native';
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
        List,
        ListItem,
        Right,
        Text,
        Title,
        View}       from 'native-base';
import commonStyles from './commonStyles';
import actions      from '../actions';


/**
 * EateryDetailScreen displaying the details of a given eatery.
 */
function EateryDetailScreen({eatery, handleClose}) {

  const verticalSpacing = (spacing=10) => <View style={{paddingVertical: spacing}}/>;

  // ?? change menu icon to left arrow
  // ? chevron-left
  // ? chevron-circle-left
  // ? chevron-double-left
  // ? angle-left
  // ? arrow-left
  // ? toggle-left
  // ? caret-square-o-left
  // ? menu-left
  // ? keyboard-arrow-left
  // ??? FROM WARNING MESSAGE
  // ??? appears you can drop md too
  // ? "md-arrow-back"      ... <-
  // ? "md-arrow-dropleft"  ... teny tiny arrow
  // ? "md-arrow-dropleft-circle"
  // ? 
  // ? 
  // ? 
  // ? 
  return (
    <Container style={commonStyles.container}>
      <Header>
        <Left>
          <Button transparent
                  onPress={handleClose}>
            <Icon name="arrow-dropleft"/>
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
          <Text>
            {eatery.name}
          </Text>

          {verticalSpacing()}
          <Text>
            {eatery.addr}
          </Text>

          {verticalSpacing()}
          <Text>
            {eatery.phone}
          </Text>

          {verticalSpacing()}
          <Text>
            Navigatte: {eatery.navUrl} ... {eatery.loc.lat} {eatery.loc.lng}
          </Text>

          {verticalSpacing()}
          <Text>
            {eatery.website}
          </Text>

        </Form>

      </Content>
      <Footer>
        <FooterTab>
          <Button full>
            <Title>Eatery Footer</Title>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
}


EateryDetailScreen.propTypes = {
  eatery: PropTypes.object.isRequired,
};


export default connect(

  // mapStateToProps()
  null,
  // ? (appState) => {
  // ?   return {
  // ?     entries:  appState.eateries.listView.entries,
  // ?     dbPool:   appState.eateries.dbPool,
  // ?   };
  // ? },

  // mapDispatchToProps()
  (dispatch) => {
    return {
      handleClose() {
        dispatch( actions.eateries.viewDetail.close() );
      },
    };
  }

)(EateryDetailScreen);
