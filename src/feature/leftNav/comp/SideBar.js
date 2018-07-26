import React           from 'react';
import {connect}       from 'react-redux';
import {withFassets }  from 'feature-u';
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
import fassets      from '../../../app';
import commonStyles from '../../commonStyles';

/**
 * SideBar: our leftNav component, exposed through the Drawer.
 */
function SideBar({deviceReady, changeView, handleFilterEatery, handleFilterDiscovery, handleSignOut, leftNavItems}) {

  // when device is NOT ready, render a placebo
  // ... ex: system fonts must be loaded
  if (!deviceReady) {
    return (
      <Text style={commonStyles.container}>
        Device NOT ready (i.e. waiting for fonts to load)
      </Text>
    );
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

          {/* production items */}
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
          </ListItem>

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

          {/* diagnostic items */}
          {/* JSX requires keys for array 
              - if NOT: Warning: Each child in an array or iterator should have a unique "key" prop.
              - I think in this case the array index will suffice, only because the fassets collection will not change
                ... assuming you don't inject the fassets key with some conditional logic
                ... otherwise, it's up to the app to supply an appropriate key
            */}
          {leftNavItems.map( (LeftNavItem, indx) => <LeftNavItem key={indx}/> )}
          
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


// ***
// *** inject various state items into our component
// ***   NOTE: we use the native redux connect() to chain multiple HoC
// ***

function mapStateToProps(appState) {
  return {
    deviceReady: fassets.device.sel.isDeviceReady(appState),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeView(viewName) {
      dispatch( fassets.currentView.actions.changeView(viewName) );
      closeSideBar();
    },
    handleFilterEatery() {
      dispatch( fassets.eateries.actions.openFilterDialog() );
      closeSideBar();
    },
    handleFilterDiscovery() {
      dispatch( fassets.discovery.actions.openFilterDialog() );
      closeSideBar();
    },
    handleSignOut() {
      dispatch( fassets.auth.actions.signOut() );
      closeSideBar();
    },
  };
}

const reduxConnectedSideBar = connect(mapStateToProps, mapDispatchToProps)(SideBar);


// ***
// *** inject various fassets (feature assets) into our component
// ***

const withFassetsSideBar = withFassets({
  mapFassetsToProps: {
    leftNavItems:  'leftNavItem.*', // this is the manifestation of our use contract ... i.e. we use these items
  }
})(reduxConnectedSideBar);

export default withFassetsSideBar;
