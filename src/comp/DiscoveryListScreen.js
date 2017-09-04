import React        from 'react';
import {connect}    from 'react-redux';
import {TouchableWithoutFeedback} from 'react-native';
import {Body,
        Button,
        Container,
        Content,
        Footer,
        FooterTab,
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

  // ? const discovery = entries.map( eateryId => dbPool[eateryId] );

  return (
    <Container style={commonStyles.container}>
      <Header>
        <Left>
          <Button transparent>
            <Icon name="menu" onPress={openSideBar}/>
          </Button>
        </Left>
        <Body>
          <Title>Discovery List</Title>
        </Body>
        <Right/>
      </Header>
      <Content>
        <Text>?? TODO: Discovery Entries Here ...</Text>
      </Content>
      <Footer>
        <FooterTab>
          {/* ???
          <Button vertical
                  onPress={handleSpin}>
            <Icon style={commonStyles.icon} name="color-wand"/>
            <Text style={commonStyles.icon}>Spin</Text>
          </Button>
            */}
        </FooterTab>
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
