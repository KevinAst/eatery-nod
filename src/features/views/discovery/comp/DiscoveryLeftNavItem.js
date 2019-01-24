import React           from 'react';
import {withFassets}   from 'feature-u';
import withState       from '../../../../util/withState';
import _discovery      from '../featureName';
import _discoveryAct   from '../actions';
import {Body,
        Button,
        Icon,
        Left,
        ListItem,
        Right,
        Text}       from 'native-base';

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

const DiscoveryLeftNavItemWithState = withState({
  component: DiscoveryLeftNavItem,
  mapDispatchToProps(dispatch, {fassets}) { // ... fassets available in ownProps (via withFassets() below)
    return {
      changeView() {
        dispatch( fassets.actions.changeView(_discovery) );
        fassets.closeLeftNav();
      },
      handleFilter() {
        dispatch( _discoveryAct.filterForm.open() );
        fassets.closeLeftNav();
      },
    };
  },
});

export default DiscoveryLeftNavItemWithFassets = withFassets({
  component: DiscoveryLeftNavItemWithState,
  mapFassetsToProps: {
    fassets: '.', // ... introduce fassets into props via the '.' keyword
  }
});
