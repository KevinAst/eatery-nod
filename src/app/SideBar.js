import React        from 'react';
import {Content,
        Text,
        View}       from 'native-base';
import commonStyles from '../comp/commonStyles';

/**
 * SideBar: our left-nav sidebar
 */
export function SideBar() {

  const verticalSpacing = <View style={{paddingVertical: 10}}/>;

  // ?? ULTIMATLY: include other app areas for things like "discoverForm"
  return (
    <Content style={{...commonStyles.container, marginTop: 80, backgroundColor:'#FFFFFF'}}>
      <Text>THIS IS MY SideDrawer!</Text>
      {verticalSpacing}
      <Text>WowZee WowZee WooWoo!</Text>
    </Content>
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
  _drawer._root.close();
}
