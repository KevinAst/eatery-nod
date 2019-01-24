import React         from 'react';
import {withFassets} from 'feature-u';
import withState     from '../../../../util/withState';
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

/**
 * DiscoveryListScreen displaying our discoveries.
 */
function DiscoveryListScreen({curUser, openLeftNav, inProgress, discoveries, nextPageToken, eateryPool, toggleEateryPool, handleNextPage, handleFilterDiscovery}) {

  // ***
  // *** define page content
  // ***

  let content = null;

  // case for discoveries retrieval in-progress
  if (discoveries===null || inProgress==='retrieve') { // just to be safe ... discoveries===null
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

  // case for NO discoveries found (in retrieval)
  else if (discoveries.length === 0) {
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

  // case for displaying retrieved discoveries
  else {
    
    function renderPoolButton(discovery) {
      if (eateryPool[discovery.id]) { // IN pool
        return (
          <Button transparent onPress={()=>toggleEateryPool(discovery, eateryPool)}>
            <Icon name="checkmark" style={{color: 'red'}}/>
          </Button>
        );
      }
      else { // NOT in pool
        return (
          <Button transparent onPress={()=>toggleEateryPool(discovery, eateryPool)}>
            <Icon name="checkmark" style={{color: 'lightgrey'}}/>
          </Button>
        );
      }
    }
    
    // generate list content
    content =
      discoveries.map( discovery => (
        <ListItem avatar key={discovery.id}>
          <Left>
            {renderPoolButton(discovery)}
          </Left>
          <Body>
            <Text>{discovery.name}</Text>
            <Text note>{discovery.addr}</Text>
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
          <Button transparent onPress={openLeftNav}>
            <Icon name="menu"/>
          </Button>
        </Left>
        <Body>
          <Title>Discovery <Text note>({curUser.pool})</Text></Title>
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

const DiscoveryListScreenWithState = withState({
  component: DiscoveryListScreen,
  mapStateToProps(appState, {fassets}) { // ... fassets available in ownProps (via withFassets() below)
    return {
      inProgress:    sel.getInProgress(appState),
      discoveries:   sel.getDiscoveries(appState),
      nextPageToken: sel.getNextPageToken(appState),
      eateryPool:    fassets.sel.getEateryDbPool(appState),
      curUser:       fassets.sel.curUser(appState),
    };
  },
  mapDispatchToProps(dispatch, {fassets}) { // ... fassets available in ownProps (via withFassets() below)
    return {
      toggleEateryPool(discovery, eateryPool) {
        if (eateryPool[discovery.id]) { // in pool
          // console.log(`xx delete ${discovery.name} from pool`);
          dispatch( fassets.actions.removeEatery(discovery.id) );
        }
        else { // NOT in pool
          // console.log(`xx add ${discovery.name} to pool`);
          dispatch( fassets.actions.addEatery(discovery.id) );
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


export default DiscoveryListScreenWithFassets = withFassets({
  component: DiscoveryListScreenWithState,
  mapFassetsToProps: {
    fassets:     '.',            // introduce fassets into props via the '.' keyword
    openLeftNav: 'openLeftNav', // openLeftNav()
  }
});
