import React        from 'react';
import connectRedux from '../../../util/connectRedux';
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
        Spinner,
        Text,
        Title}       from 'native-base';
import commonStyles  from '../../commonStyles';
import actions       from '../actions';
import * as sel      from '../state';
import fassets       from '../../../app';

/**
 * DiscoveryListScreen displaying our discovered eateries.
 */
function DiscoveryListScreen({inProgress, eateries, nextPageToken, eateryPool, toggleEateryPool, handleNextPage, handleFilterDiscovery}) {

  // ***
  // *** define page content
  // ***

  let content = null;

  // case for eateries retrieval in-progress
  if (eateries===null || inProgress==='retrieve') { // just to be safe ... eateries===null
    content = [
      <ListItem key="inProgress">
        <Left/>
        <Body>
          <Button transparent>
            <Spinner color="blue"/>
          </Button>
        </Body>
        <Right/>
      </ListItem>
    ];
  }

  // case for NO eateries found (in retrieval)
  else if (eateries.length === 0) {
    content = [
      <ListItem key="noEntries">
        <Body>
          <Text>No entries match your filter.</Text>
          <Button transparent active onPress={handleFilterDiscovery}>
            <Icon name="options"/>
            <Text>Adjust Filter</Text>
          </Button>
        </Body>
      </ListItem>
    ];
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
    content =
      eateries.map( eatery => (
        <ListItem avatar key={eatery.id}>
          <Left>
            {renderPoolButton(eatery)}
          </Left>
          <Body>
            <Text>{eatery.name}</Text>
            <Text note>{eatery.addr}</Text>
          </Body>
        </ListItem>
      ));

    // provide CRUDE next page mechanism
    if (nextPageToken) {
      const nextPageContent = inProgress==='next'
                                ? <Button transparent><Spinner color="blue"/></Button>
                                : <Button transparent onPress={()=>handleNextPage(nextPageToken)}>
                                    <Icon name="refresh"/>
                                    <Text>more</Text>
                                  </Button>;
      content.push(
        <ListItem key="nextPage">
          <Body>
            {nextPageContent}
          </Body>
        </ListItem>
      );
    }
    // notify user when 60 entry limitation has been met (a limitation of the "free" Google Places API)
    else if (content.length === 60) {
      content.push(
        <ListItem key="maxEntriesHit">
          <Body>
            <Text>Our usage of Google Places is limited to 60 entries.</Text>
            <Text note>Please adjust your search text with city or restaurant.</Text>
            <Button transparent active onPress={handleFilterDiscovery}>
              <Icon name="options"/>
              <Text>Adjust Filter</Text>
            </Button>
          </Body>
        </ListItem>
      );
    }
  }

  return (
    <Container style={commonStyles.container}>
      <Header>
        <Left>
          <Button transparent onPress={fassets.leftNav.open}>
            <Icon name="menu"/>
          </Button>
        </Left>
        <Body>
          <Title>Discovery</Title>
        </Body>
        <Right/>
      </Header>
      <Content>
        <List>
          {content}
        </List>
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

export default connectRedux(DiscoveryListScreen, {
  mapStateToProps(appState) {
    return {
      inProgress:    sel.getInProgress(appState),
      eateries:      sel.getEateries(appState),
      nextPageToken: sel.getNextPageToken(appState),
      eateryPool:    fassets.eateries.sel.getDbPool(appState),
    };
  },
  mapDispatchToProps(dispatch) {
    return {
      toggleEateryPool(eatery, eateryPool) {
        if (eateryPool[eatery.id]) { // in pool
          // console.log(`xx delete ${eatery.name} from pool`);
          dispatch( fassets.eateries.actions.remove(eatery.id) );
        }
        else { // NOT in pool
          // console.log(`xx add ${eatery.name} to pool`);
          dispatch( fassets.eateries.actions.add(eatery.id) );
        }
      },
      handleNextPage(nextPageToken) {
        dispatch( actions.nextPage(nextPageToken) );
      },
      handleFilterDiscovery() {
        dispatch( actions.filterForm.open() );
      },
    };
  },
});
