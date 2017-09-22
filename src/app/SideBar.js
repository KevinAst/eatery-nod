import React        from 'react';
import {connect}    from 'react-redux';
import {Body,
        Button,
        Container,
        Content,
        Icon,
        Header,
        Left,
        List,
        ListItem,
        Right,
        Text,
        Title}      from 'native-base';
import commonStyles from '../comp/commonStyles';
import actions      from '../actions';

/**
 * SideBar: our left-nav sidebar
 */
function SideBar({systemReady, filter, changeView, filterDiscovery}) {

  if (!systemReady)
    return <Text/>

  function handleFilterDiscovery() {
    filterDiscovery(filter);
  }

  return (
    <Container style={{...commonStyles.container, backgroundColor:'white'}}>
      <Header>
        <Body>
          <Title>Select a view</Title>
        </Body>
      </Header>
      <Content>
        <List>

          <ListItem icon onPress={()=>changeView('eateries')}>
            <Left>
              <Icon name="bonfire" style={{color: 'red'}}/>
            </Left>
            <Body>
              <Text style={{color: 'red'}}>Eatery Pool</Text>
            </Body>
            <Right/>
          </ListItem>

          <ListItem icon onPress={()=>changeView('discovery')}>
            <Left>
              <Icon name="cloud" style={{color: 'green'}}/>
            </Left>
            <Body>
              <Text style={{color: 'green'}}>Discovery</Text>
            </Body>
            <Right>
              <Button transparent onPress={handleFilterDiscovery}>
                <Icon active name="options"/>
              </Button>
            </Right>
          </ListItem>

        </List>
      </Content>
    </Container>
  );
}

let _drawer = null;
export function registerDrawer(drawer) {
  _drawer = drawer;
}

export function openSideBar() {
  _drawer._root.open();
}

export function closeSideBar() {
  setTimeout(() => _drawer._root.close(), 1); // delay so as to have new view up when sidebar closes (HACK)
}

export default connect(

  // mapStateToProps()
  (appState) => {
    return {
      systemReady: appState.systemReady,
      filter:      appState.discovery.filter,
    };
  },

  // mapDispatchToProps()
  (dispatch, ownProps) => {
    return {

      changeView(view) {
        dispatch( actions.view.change(view) );
        closeSideBar();
      },

      filterDiscovery(filter) {
        dispatch( actions.discovery.filter.open(filter) );
        closeSideBar();
      },

    };
  }

)(SideBar);
