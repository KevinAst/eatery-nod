import React        from 'react';
import connectRedux from '../../../util/connectRedux';
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
import app          from '../../../app';
import commonStyles from '../../commonStyles';

/**
 * SideBar: our leftNav component, exposed through the Drawer.
 */
function SideBar({deviceReady, changeView, handleFilterEatery, handleFilterDiscovery, handleSignOut}) {

  // when device is NOT ready, render a placebo
  // ... ex: system fonts must be loaded
  if (!deviceReady) {
    return (
      <Text style={commonStyles.container}>
        Device NOT ready (i.e. waiting for fonts to load)
      </Text>
    );
  }

  // define our production menu items
  let menuItems = [

    <ListItem key="eateriesMenu" icon onPress={()=>changeView('eateries')}>
      <Left>
        <Icon name="bonfire" style={{color: 'red'}}/>
      </Left>
      <Body>
        <Text style={{color: 'red'}}>Pool</Text>
      </Body>
      <Right>
        <Button transparent onPress={handleFilterEatery}>
          <Icon active name="options"/>
        </Button>
      </Right>
    </ListItem>,

    <ListItem key="discoveryMenu" icon onPress={()=>changeView('discovery')}>
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

  ];

  // optionally inject any sandbox menu items (when the feature is enabled)
  if (app.sandbox && app.sandbox.leftNavListItems) {
    menuItems = [...menuItems, app.sandbox.leftNavListItems];
  }

  // render our menu
  return (
    <Container style={{...commonStyles.container, backgroundColor:'white'}}>
      <Header>
        <Body>
          <Title>Select a view</Title>
        </Body>
        <Right>
          <Button transparent onPress={handleSignOut}>
            <Icon active name="log-out"/>
          </Button>
        </Right>
      </Header>
      <Content>
        <List>
          {menuItems}
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


export default connectRedux(SideBar, {
  mapStateToProps(appState) {
    return {
      deviceReady: app.device.sel.isDeviceReady(appState),
    };
  },
  mapDispatchToProps(dispatch) {
    return {
      changeView(viewName) {
        dispatch( app.view.actions.changeView(viewName) );
        closeSideBar();
      },
      handleFilterEatery() {
        dispatch( app.eateries.actions.openFilterDialog() );
        closeSideBar();
      },
      handleFilterDiscovery() {
        dispatch( app.discovery.actions.openFilterDialog() );
        closeSideBar();
      },
      handleSignOut() {
        dispatch( app.auth.actions.signOut() );
        closeSideBar();
      },
    };
  },
});
