import React        from 'react';
import {connect}    from 'react-redux';
import {TouchableWithoutFeedback} from 'react-native';
import {Body,
        Button,
        Container,
        Content,
        Footer,
        Header,
        Icon,
        Left,
        List,
        ListItem,
        Right,
        Text,
        Title}       from 'native-base';
import commonStyles  from './commonStyles';
import actions       from '../actions';
import {openSideBar} from '../app/SideBar';

/**
 * DiscoveryListScreen displaying our discovered eateries.
 */
export default function DiscoveryListScreen(/* ?? {entries, dbPool, showDetail, handleSpin}*/) {

  return (
    <Container style={commonStyles.container}>
      <Header>
        <Left>
          <Button transparent onPress={openSideBar}>
            <Icon name="menu"/>
          </Button>
        </Left>
        <Body>
          <Title>Discovery</Title>
        </Body>
        <Right/>
      </Header>
      <Content>
        <Text>?? TODO: Discovery Entries Here ...</Text>
      </Content>
      <Footer>
        <Left/>
        <Body>
          <Text style={{color: 'white', fontStyle: 'italic'}}>checked items are in your pool</Text>
        </Body>
        <Right/>
      </Footer>

    </Container>
  );
}

// ???
// ? export default connect(
// ? 
// ?   // mapStateToProps()
// ?   (appState) => {
// ?     return {
// ?       entries:  appState.discovery.listView.entries,
// ?       dbPool:   appState.discovery.dbPool,
// ?     };
// ?   },
// ? 
// ?   // mapDispatchToProps()
// ?   (dispatch) => {
// ?     return {
// ?       showDetail(eateryId) {
// ?         //console.log(`??? showDetail for ${eateryId}`);
// ?         dispatch( actions.discovery.viewDetail(eateryId) );
// ?       },
// ?       handleSpin() {
// ?         dispatch( actions.discovery.spin() );
// ?       },
// ?     };
// ?   }
// ? 
// ? )(DiscoveryListScreen);
