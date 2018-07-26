import React       from 'react';
import {Body,
        Button,
        Icon,
        Left,
        ListItem,
        Right,
        Text}      from 'native-base';
import fassets     from '../../app';
import {notify,
        toast,
        alert,
        confirm}   from '../../util/notify';

/**
 * The Public Face promoted by this feature.
 */
export default {

  // inject the 'leftNavItem.*' used by the leftNav feature (when this sandbox feature is enabled)
  defineUse: {

    // ***
    // *** Sandbox items to see what happens to logs in published apps
    // ***

    'leftNavItem.publishedLogTestXheader': () => (
      <ListItem itemDivider>
        <Text>Published Logs Test</Text>
      </ListItem>
    ),

    'leftNavItem.publishedLogTestXlog': () => (
      <ListItem icon onPress={()=>console.log('Here is a console.log() probe.')}>
        <Left>
          <Icon name="alert" style={{color: 'black'}}/>
        </Left>
        <Body left={1}>
          <Text style={{color: 'black'}}>console.log()</Text>
        </Body>
        <Right/>
      </ListItem>
    ),
    
    'leftNavItem.publishedLogTestXwarn': () => (
      <ListItem icon onPress={()=>console.warn('Here is a console.warn() probe.')}>
        <Left>
          <Icon name="alert" style={{color: 'orange'}}/>
        </Left>
        <Body left={1}>
          <Text style={{color: 'orange'}}>console.warn()</Text>
        </Body>
        <Right/>
      </ListItem>
    ),
    
    'leftNavItem.publishedLogTestXerror': () => (
      <ListItem icon onPress={()=>console.error('Here is a console.error() probe.')}>
        <Left>
          <Icon name="alert" style={{color: 'red'}}/>
        </Left>
        <Body left={1}>
          <Text style={{color: 'red'}}>console.error()</Text>
        </Body>
        <Right/>
      </ListItem>
    ),

    
    // ***
    // *** Sandbox tests of our notify utility
    // ***
    
    'leftNavItem.notify': () => (
      <ListItem itemDivider>
        <Text>Notify Sandbox</Text>
      </ListItem>
    ),
    
    'leftNavItem.notifyXMsg': () => (
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
    ),
    
    'leftNavItem.notifyXMsgXwXDur': () => (
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
    ),
    
    'leftNavItem.notifyXMsgXwXAct': () => (
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
    ),
    
    'leftNavItem.notifyXMsgXwXActXDur': () => (
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
    ),
    
    'leftNavItem.wrapper': () => (
      <ListItem itemDivider>
        <Text>Notify Wrappers</Text>
      </ListItem>
    ),
    
    'leftNavItem.wrapperXtoast': () => (
      <ListItem icon onPress={()=> {closeSideBar(); toast({ msg:'Here is a toast to you!' })}}>
        <Left>
          <Icon name="alert" style={{color: 'purple'}}/>
        </Left>
        <Body left={1}>
          <Text style={{color: 'purple'}}>toast()</Text>
        </Body>
      </ListItem>
    ),
    
    'leftNavItem.wrapperXtoastXwarn': () => (
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
    ),
    
    'leftNavItem.wrapperXtoastXerror': () => (
      <ListItem icon onPress={()=> {closeSideBar(); alert.error({ msg: 'This is an alert error.\nYou must explicitly acknowledge it by clicking OK.' })}}>
        <Left>
          <Icon name="alert" style={{color: 'purple'}}/>
        </Left>
        <Body left={1}>
          <Text style={{color: 'purple'}}>alert.error()</Text>
        </Body>
      </ListItem>
    ),
    
    'leftNavItem.wrapperXconfirmXwarn': () => (
      <ListItem icon onPress={()=> {
          closeSideBar();
          confirm.warn({ 
            msg: 'This is an confirm warning.\nYou must explicitly acknowledge it.',
            actions: [
              { txt: 'Discard Changes', action: () => toast({ msg: 'Discarding Changes'}) },
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
    ),

    // 'leftNavItem.testInvalidComp': new Date(),

  }
};


function closeSideBar() {
  fassets.leftNav.close();
}

// ***
// *** Sandbox functions, interactively testing our notify utility
// ***

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
      { txt: 'Discard Changes', action: () => toast({ msg: 'Discarding Changes'}) },
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
      { txt: 'Undo', action: () => toast({ msg: 'UnDoing'}) },
    ],
  });
}
