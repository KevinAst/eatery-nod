import React        from 'react';
import {connect}    from 'react-redux';
import {TouchableWithoutFeedback} from 'react-native'; // ?? unsure why TouchableHighlight does NOT work
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
        Title}      from 'native-base';
import commonStyles from './commonStyles';
import actions      from '../actions';

/**
 * EateriesListScreen displaying a set of eateries (possibly filtered).
 */
function EateriesListScreen({entries, dbPool, showDetail, handleSpin}) {

  const eateries = entries.map( eateryId => dbPool[eateryId] );

  return (
    <Container style={commonStyles.container}>
      <Header>
        <Left>
          <Button transparent>
            <Icon name="menu"/>
          </Button>
        </Left>
        <Body>
          <Title>Eateries List</Title>
        </Body>
        <Right/>
      </Header>
      <Content>
        <List>
          { 
            eateries.map( eatery => (
              <TouchableWithoutFeedback key={eatery.id}
                                        onPress={()=>showDetail(eatery.id)}>
                <ListItem>
                  <Text>{eatery.name}</Text>
                </ListItem>
              </TouchableWithoutFeedback>
            ))
          }
          {/* ?? temporarly emit multiple times to test scrolling */}
          { <ListItem itemDivider key="divide2"><Text>Temp Dups</Text></ListItem> }
          {
            eateries.map( eatery => (
              <ListItem key={eatery.id+'2'}>
                <Text>{eatery.name}</Text>
              </ListItem>
            ))
          }
          {/* ?? ditto */}
          { <ListItem itemDivider key="divide3"><Text>Temp Dups</Text></ListItem> }
          {
            eateries.map( eatery => (
              <ListItem key={eatery.id+'3'}>
                <Text>{eatery.name}</Text>
              </ListItem>
            ))
          }
        </List>
      </Content>
      <Footer>
        <Button transparent
                onPress={handleSpin}>
          <Icon name="color-wand" style={{color:'white'}}/>
          <Text style={{color:'white'}}>spin</Text>
        </Button>
      </Footer>

    </Container>
  );
}

export default connect(

  // mapStateToProps()
  (appState) => {
    return {
      entries:  appState.eateries.listView.entries,
      dbPool:   appState.eateries.dbPool,
    };
  },

  // mapDispatchToProps()
  (dispatch) => {
    return {
      showDetail(eateryId) {
        //console.log(`??? showDetail for ${eateryId}`);
        dispatch( actions.eateries.viewDetail(eateryId) );
      },
      handleSpin() {
        dispatch( actions.eateries.spin() );
      },
    };
  }

)(EateriesListScreen);
