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
function DiscoveryListScreen({eateries, nextPageToken}) {

  // ?? ALL NEW ... ? check imports
  let content = null;

  if (eateries===null) {
    content = 
      <ListItem>
        <Text>SPINNER HERE??</Text>
      </ListItem>;
  }
  else if (eateries.length === 0) {
    content = 
      <ListItem>
        <Text>NOTHING FOUND??</Text>
      </ListItem>
  }
  else {
    content = 
      eateries.map( eatery => (
        <ListItem key={eatery.id}>
          <Text>{`${eatery.name}\n${eatery.addr}`}</Text>
        </ListItem>
      ));
    if (nextPageToken) { // crude next page interface ?? need a real link ?? WITH an API ?? AND reducer to append, etc. etc. etc.
      content.push(
        <ListItem key="nextPage">
          <Text>... more</Text>
        </ListItem>
      );
    }
    else if (content.length === 60) { // 60 entries with NO nextPageToken indicate a limitation using the free Google Places API
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
        <Left/>
        <Body>
          <Text style={{color: 'white', fontStyle: 'italic'}}>checked items are in your pool</Text>
        </Body>
        <Right/>
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
    };
  },

  // mapDispatchToProps()
  (dispatch) => {
    return {
//?   showDetail(eateryId) {
//?     dispatch( actions.discovery.viewDetail(eateryId) );
//?   },
//?   handleSpin() {
//?     dispatch( actions.discovery.spin() );
//?   },
    };
  }

)(DiscoveryListScreen);
