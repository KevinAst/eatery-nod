import React        from 'react';
import connectRedux from '../common/util/connectRedux';
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
import commonStyles from './commonStyles';
import {notify, 
        toast,
        alert,
        confirm}    from '../common/util/notify';

// TODO: ?? RETROFIT: ALL props, actions, state, MUST be retrofitted to use use app.{feature} .selector.xxx -and- .actions.xxx

/**
 * SideBar: our left-nav sidebar
 * 
 * TODO: resolve SideBar coupling issue with generic feature-u utility.
 *       
 *       SideBar (an app-specific component) is currently directly used by feature-u (an inappropriate dependency)
 *       
 *       This is a temporary measure to get us going.
 *           - included directly in feature-u runApp()
 *           - access app-specific resources (importing app, accessing app/feature specific actions/state
 *       
 *       Long Term solutions to consider are:
 *           - some parameterization of runApp([sideBar>), optionally dynamically injecting Drawer as needed
 *        OR - some feature-based injection
 *             * createFeature( accept sideBar)
 *             * runApp() only one sideBar accepeted (from all features)
 *             * setup (below): interface is tricky
 *               - dynamically inject Drawer when side-bar is defined
 *               - BAD: has some coupling with our sidebar implementation ... registerDrawer()
 *                      ... unsure how this would be acomplished (need more throught)
 *             * KEY: this sideBar feature would have public knowledge of other app features, invoking their actions, accessing their state, etc.
 */
// ?? RETROFIT: props here (see note above)
function SideBar({deviceStatus, changeView, handleFilterDiscovery, handleFilterEatery, handleSignOut}) {

  // ?? RETROFIT: temp to display it (see note above)
  return <Text>TODO: RETROFIT to access features.</Text>;

  if (deviceStatus !== 'READY') { // ... render placebo, until system fonts have been loaded
    return <Text/>
  }
  
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

          <ListItem icon onPress={()=>changeView('eateries')}>
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

{/* Sandbox tests of what happens to logs in published apps
          <ListItem itemDivider>
            <Text>Published Logs Test</Text>
          </ListItem>

          <ListItem icon onPress={()=>console.log('Here is a console.log() probe.')}>
            <Left>
              <Icon name="alert" style={{color: 'black'}}/>
            </Left>
            <Body left={1}>
              <Text style={{color: 'black'}}>console.log()</Text>
            </Body>
            <Right/>
          </ListItem>

          <ListItem icon onPress={()=>console.warn('Here is a console.warn() probe.')}>
            <Left>
              <Icon name="alert" style={{color: 'orange'}}/>
            </Left>
            <Body left={1}>
              <Text style={{color: 'orange'}}>console.warn()</Text>
            </Body>
            <Right/>
          </ListItem>

          <ListItem icon onPress={()=>console.error('Here is a console.error() probe.')}>
            <Left>
              <Icon name="alert" style={{color: 'red'}}/>
            </Left>
            <Body left={1}>
              <Text style={{color: 'red'}}>console.error()</Text>
            </Body>
            <Right/>
          </ListItem>
  */}

{/* Sandbox tests of our notify utility
          <ListItem itemDivider>
            <Text>Notify Sandbox</Text>
          </ListItem>

          <ListItem icon onPress={()=>Msg(false)}>
            <Left>
              <Icon name="alert" style={{color: 'purple'}}/>
            </Left>
            <Body left={1}>
              <Text style={{color: 'purple'}}>Msg</Text>
            </Body>
            <Right>
              <Button transparent onPress={()=>Msg(true)}>
                <Icon active name="desktop"/>
              </Button>
            </Right>
          </ListItem>

          <ListItem icon onPress={()=>Msg_w_Dur(false)}>
            <Left>
              <Icon name="alert" style={{color: 'purple'}}/>
            </Left>
            <Body left={1}>
              <Text style={{color: 'purple'}}>Msg_w_Dur</Text>
            </Body>
            <Right>
              <Button transparent onPress={()=>Msg_w_Dur(true)}>
                <Icon active name="desktop"/>
              </Button>
            </Right>
          </ListItem>

          <ListItem icon onPress={()=>Msg_w_Act(false)}>
            <Left>
              <Icon name="alert" style={{color: 'purple'}}/>
            </Left>
            <Body left={1}>
              <Text style={{color: 'purple'}}>Msg_w_Act</Text>
            </Body>
            <Right>
              <Button transparent onPress={()=>Msg_w_Act(true)}>
                <Icon active name="desktop"/>
              </Button>
            </Right>
          </ListItem>

          <ListItem icon onPress={()=>Msg_w_Act_Dur(false)}>
            <Left>
              <Icon name="alert" style={{color: 'purple'}}/>
            </Left>
            <Body left={1}>
              <Text style={{color: 'purple'}}>Msg_w_Act_Dur</Text>
            </Body>
            <Right>
              <Button transparent onPress={()=>Msg_w_Act_Dur(true)}>
                <Icon active name="desktop"/>
              </Button>
            </Right>
          </ListItem>

          <ListItem itemDivider>
            <Text>Notify Wrappers</Text>
          </ListItem>

          <ListItem icon onPress={()=> {closeSideBar(); toast({ msg:'Here is a toast to you!' })}}>
            <Left>
              <Icon name="alert" style={{color: 'purple'}}/>
            </Left>
            <Body left={1}>
              <Text style={{color: 'purple'}}>toast()</Text>
            </Body>
          </ListItem>

          <ListItem icon onPress={()=> {
              closeSideBar();
              toast.warn({
                msg:'Your item was deleted.',
                actions: [
                  { txt: 'undo', action: () => toast({ msg: 'OK then ... make up your mind'}) },
                ]
              });
            }}>
            <Left>
              <Icon name="alert" style={{color: 'purple'}}/>
            </Left>
            <Body left={1}>
              <Text style={{color: 'purple'}}>toast.warn()</Text>
            </Body>
          </ListItem>

          <ListItem icon onPress={()=> {closeSideBar(); alert.error({ msg: 'This is an alert error.\nYou must explicitly acknowledge it by clicking OK.' })}}>
            <Left>
              <Icon name="alert" style={{color: 'purple'}}/>
            </Left>
            <Body left={1}>
              <Text style={{color: 'purple'}}>alert.error()</Text>
            </Body>
          </ListItem>

          <ListItem icon onPress={()=> {
              closeSideBar();
              confirm.warn({ 
                msg: 'This is an confirm warning.\nYou must explicitly acknowledge it.',
                actions: [
                  { txt: 'Discard Changes', action: () => console.log('xx Discarding Changes') },
                  { txt: 'Go Back' }
                ]
              });
            }}>
            <Left>
              <Icon name="alert" style={{color: 'purple'}}/>
            </Left>
            <Body left={1}>
              <Text style={{color: 'purple'}}>confirm.warn()</Text>
            </Body>
          </ListItem>
  */}

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
      // ?? RETROFIT: appState/actions (see note above)
      // ? deviceStatus: appState.device.status,
    };
  },
  mapDispatchToProps(dispatch) {
    return {
      // ?? RETROFIT: appState/actions (see note above)
      // ? changeView(view) {
      // ?   dispatch( actions.view.change(view) );
      // ?   closeSideBar();
      // ? },
      // ? handleFilterDiscovery() {
      // ?   dispatch( actions.discovery.filter.open() );
      // ?   closeSideBar();
      // ? },
      // ? handleFilterEatery() {
      // ?   dispatch( actions.eateries.applyFilter.open() );
      // ?   closeSideBar();
      // ? },
      // ? handleSignOut() {
      // ?   dispatch( actions.auth.signOut() );
      // ?   closeSideBar();
      // ? },
    };
  },
});

// Sandbox tests of our notify utility
function Msg(modal) {
  closeSideBar();
  notify({
    msg:   'Msg by itself.\nExpecting a default OK',
    modal,
  });
}

function Msg_w_Dur(modal) {
  closeSideBar();
  notify({
    msg:      'Msg with Duration.',
    duration: 3,
    level:    'info',
    modal,
  });
}

function Msg_w_Act(modal) {
  closeSideBar();
  notify({
    msg:   'Msg with Action.',
    level: 'warn',
    modal,
    actions: [
      { txt: 'Discard Changes', action: () => console.log('xx Discarding Changes') },
      { txt: 'Go Back' }
    ],
  });
}

function Msg_w_Act_Dur(modal) {
  closeSideBar();
  notify({
    msg:      'Msg with Duration and Action.',
    duration: 5,
    level:    'error',
    modal,
    actions: [
      { txt: 'Undo', action: () => console.log('xx UnDoing') },
    ],
  });
}
