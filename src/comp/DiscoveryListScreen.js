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
function DiscoveryListScreen({eateries, nextPageToken, eateryPool, toggleEateryPool}) {

  // ***
  // *** define page content
  // ***

  let content = null;

  // case for eateries retrieval in-progress
  if (eateries===null) {
    content = 
      <ListItem>
        <Text>SPINNER HERE??</Text>
      </ListItem>;
  }

  // case for NO eateries found (in retrieval)
  else if (eateries.length === 0) {
    content = 
      <ListItem>
        <Text>NOTHING FOUND??</Text>
      </ListItem>
  }

  // case for displaying retrieved eateries
  else {
    
    function renderPoolButton(eatery) {
      if (eateryPool[eatery.id]) { // IN pool
        return (
          <Button transparent onPress={()=>toggleEateryPool(eatery, eateryPool)}>
            <Icon name="checkmark" style={{color: 'red'}}/>
          </Button>
        );
      }
      else { // NOT in pool
        return (
          <Button transparent onPress={()=>toggleEateryPool(eatery, eateryPool)}>
            <Icon name="checkmark" style={{color: 'lightgrey'}}/>
          </Button>
        );
      }
    }
    
    // generate list content
    content = // ... avatar ListItem provides enough space to display address too
      eateries.map( eatery => (
        <ListItem avatar key={eatery.id}>
          <Left>
            {renderPoolButton(eatery)}
          </Left>
          <Body>
            <Text>{`${eatery.name}\n${eatery.addr}`}</Text>
          </Body>
        </ListItem>
      ));

    // provide CRUDE next page mechnism
    if (nextPageToken) { // ?? need real link ?? WITH an API ?? AND reducer to append, etc. etc. etc.
      content.push(
        <ListItem key="nextPage">
          <Left/>
          <Body>
            <Text>... more</Text>
          </Body>
          <Right/>
        </ListItem>
      );
    }
    // notify user when 60 entry limitation has been met (a limitation of the "free" Google Places API)
    else if (content.length === 60) {
      // ?? test this out
      content.push(
        <ListItem key="maxEntriesHit">
          <Text>... our usage of Google Places is limited to 60 entries (please adjust the search text - with city or restaurant)</Text>
        </ListItem>
      );
    }
  }

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
        {content}
      </Content>
      <Footer>
        <Body>
          <Button transparent>
            <Icon name="checkmark" style={{color: 'red'}}/>
          </Button>
          <Text style={{color: 'white', fontStyle: 'italic'}}>red checked items are in your pool</Text>
        </Body>
      </Footer>
    </Container>
  );
}

export default connect(

  // mapStateToProps()
  (appState) => {
    return {
      eateries:      appState.discovery.eateries,
      nextPageToken: appState.discovery.nextPageToken,
      eateryPool:    appState.eateries.dbPool,
    };
  },

  // mapDispatchToProps()
  (dispatch) => {
    return {
      toggleEateryPool(eatery, eateryPool) {
        if (eateryPool[eatery.id]) { // in pool
          // console.log(`xx delete ${eatery.name} from pool`);
          dispatch( actions.eateries.dbPool.remove(eatery.id) );
        }
        else { // NOT in pool
          // console.log(`xx add ${eatery.name} to pool`);
          dispatch( actions.eateries.dbPool.add(eatery.id) );
        }
      },
    };
  }

)(DiscoveryListScreen);
