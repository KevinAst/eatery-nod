import React        from 'react';
import {connect}    from 'react-redux';
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

/**
 * EateriesListScreen displaying a set of eateries (possibly filtered).
 */
function EateriesListScreen({entries, dbPool}) {

  const eateries = entries.map( eateryKey => dbPool[eateryKey] );

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
              <ListItem key={eatery.id}>
                <Text>{eatery.name}</Text>
                <Text>{eatery.phone}</Text>
              </ListItem>
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
        <FooterTab>
          <Button full>
            <Title>List View Footer</Title>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
}

export default connect(
  appState => { // mapStateToProps
    return {
      entries:  appState.eateries.listView.entries,
      dbPool:   appState.eateries.dbPool,
    };
  })(EateriesListScreen);
