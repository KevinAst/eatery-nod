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
import {notify, 
        toast,
        alert,
        confirm}    from '../util/notify';

/**
 * SideBar: our left-nav sidebar
 */
function SideBar({systemReady, changeView, handleFilterDiscovery}) {

  if (!systemReady)
    return <Text/>

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

          {/* Sandbox tests of our notify utility */}
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
    };
  },

  // mapDispatchToProps()
  (dispatch, ownProps) => {
    return {

      changeView(view) {
        dispatch( actions.view.change(view) );
        closeSideBar();
      },

      handleFilterDiscovery() {
        dispatch( actions.discovery.filter.open() );
        closeSideBar();
      },

    };
  }

)(SideBar);


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
