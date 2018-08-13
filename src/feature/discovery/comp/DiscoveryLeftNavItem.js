import React           from 'react';
import withState       from '../../../util/withState';
import featureName     from '../featureName';
import actions         from '../actions';
import {Body,
        Button,
        Icon,
        Left,
        ListItem,
        Right,
        Text}       from 'native-base';
import fassets      from '../../../app';

/**
 * DiscoveryLeftNavItem: our Discovery entry into the leftNav.
 */
function DiscoveryLeftNavItem({changeView, handleFilter}) {

  // render our menu item
  return (
    <ListItem icon onPress={()=>changeView()}>
      <Left>
        <Icon name="cloud" style={{color: 'green'}}/>
      </Left>
      <Body>
        <Text style={{color: 'green'}}>Discovery</Text>
      </Body>
      <Right>
        <Button transparent onPress={handleFilter}>
          <Icon active name="options"/>
        </Button>
      </Right>
    </ListItem>
  );
}

export default DiscoveryLeftNavItemWithState = withState({
  component: DiscoveryLeftNavItem,
  mapDispatchToProps(dispatch) {
    return {
      changeView() {
        dispatch( fassets.currentView.actions.changeView(featureName) );
        fassets.leftNav.close();
      },
      handleFilter() {
        dispatch( actions.filterForm.open() );
        fassets.leftNav.close();
      },
    };
  },
});
