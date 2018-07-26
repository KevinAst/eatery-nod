import React       from 'react';
import {Body,
        Button,
        Icon,
        Left,
        ListItem,
        Right,
        Text}      from 'native-base';
import fassets     from '../../../app';
import {notify,
        toast,
        alert,
        confirm}   from '../../../util/notify';

/**
 * The sandbox ListItems to inject in our leftNav feature (when enabled).
 */
export default [

  // ***
  // *** Sandbox tests to see what happens to logs in published apps
  // ***

  <ListItem key="publishedLogTest_header" itemDivider>
    <Text>Published Logs Test</Text>
  </ListItem>,

  <ListItem key="publishedLogTest_log" icon onPress={()=>console.log('Here is a console.log() probe.')}>
    <Left>
      <Icon name="alert" style={{color: 'black'}}/>
    </Left>
    <Body left={1}>
      <Text style={{color: 'black'}}>console.log()</Text>
    </Body>
    <Right/>
  </ListItem>,

  <ListItem key="publishedLogTest_warn" icon onPress={()=>console.warn('Here is a console.warn() probe.')}>
    <Left>
      <Icon name="alert" style={{color: 'orange'}}/>
    </Left>
    <Body left={1}>
      <Text style={{color: 'orange'}}>console.warn()</Text>
    </Body>
    <Right/>
  </ListItem>,

  <ListItem key="publishedLogTest_error" icon onPress={()=>console.error('Here is a console.error() probe.')}>
    <Left>
      <Icon name="alert" style={{color: 'red'}}/>
    </Left>
    <Body left={1}>
      <Text style={{color: 'red'}}>console.error()</Text>
    </Body>
    <Right/>
  </ListItem>,


  // ***
  // *** Sandbox tests of our notify utility
  // ***

  <ListItem key="notify" itemDivider>
    <Text>Notify Sandbox</Text>
  </ListItem>,

  <ListItem key="notify_Msg" icon onPress={()=>Msg(false)}>
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
  </ListItem>,

  <ListItem key="notify_Msg_w_Dur" icon onPress={()=>Msg_w_Dur(false)}>
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
  </ListItem>,

  <ListItem key="notify_Msg_w_Act" icon onPress={()=>Msg_w_Act(false)}>
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
  </ListItem>,

  <ListItem key="notify_Msg_w_Act_Dur" icon onPress={()=>Msg_w_Act_Dur(false)}>
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
  </ListItem>,

  <ListItem key="wrapper" itemDivider>
    <Text>Notify Wrappers</Text>
  </ListItem>,

  <ListItem key="wrapper_toast" icon onPress={()=> {closeSideBar(); toast({ msg:'Here is a toast to you!' })}}>
    <Left>
      <Icon name="alert" style={{color: 'purple'}}/>
    </Left>
    <Body left={1}>
      <Text style={{color: 'purple'}}>toast()</Text>
    </Body>
  </ListItem>,

  <ListItem key="wrapper_toast_warn" icon onPress={()=> {
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
  </ListItem>,

  <ListItem key="wrapper_toast_error" icon onPress={()=> {closeSideBar(); alert.error({ msg: 'This is an alert error.\nYou must explicitly acknowledge it by clicking OK.' })}}>
    <Left>
      <Icon name="alert" style={{color: 'purple'}}/>
    </Left>
    <Body left={1}>
      <Text style={{color: 'purple'}}>alert.error()</Text>
    </Body>
  </ListItem>,

  <ListItem key="wrapper_confirm_warn" icon onPress={()=> {
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
  </ListItem>,

];


function closeSideBar() {
  fassets.leftNav.close();
}

// ***
// *** Sandbox tests of our notify utility
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
