import React           from 'react';
import withState       from '../../../util/withState';
import {withFassets }  from 'feature-u';
import {Body,
        Button,
        Container,
        Content,
        Icon,
        Header,
        List,
        Right,
        Text,
        Title}      from 'native-base';
import fassets      from '../../../app';
import commonStyles from '../../commonStyles';

/**
 * SideBar: our leftNav component, exposed through the Drawer.
 */
function SideBar({deviceReady, handleSignOut, leftNavItems}) {

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
          {/* pull in leftNav menu items from accross all features */}
          {leftNavItems.map( (LeftNavItem, indx) => <LeftNavItem key={indx}/> )}
        </List>
      </Content>
    </Container>
  );
}


// ***
// *** various SideBar utility functions
// ***

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
// ***

const SideBarWithState = withState({
  component: SideBar,
  mapStateToProps(appState) {
    return {
      deviceReady: fassets.device.sel.isDeviceReady(appState),
    };
  },
  mapDispatchToProps(dispatch) {
    return {
      handleSignOut() {
        dispatch( fassets.auth.actions.signOut() );
        closeSideBar();
      },
    };
  },
});


// ***
// *** inject various fassets (feature assets) into our component
// ***

export default SideBarWithFassets = withFassets({
  component: SideBarWithState,
  mapFassetsToProps: {
    leftNavItems:  'leftNavItem.*', // this is the manifestation of our use contract ... i.e. we use these items
  }
});
