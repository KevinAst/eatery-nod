import React         from 'react';
import {withFassets} from 'feature-u';
import withState     from '../../../util/withState';
import featureName   from '../featureName';
import actions       from '../actions';
import {Body,
        Button,
        Icon,
        Left,
        ListItem,
        Right,
        Text}        from 'native-base';

/**
 * EateryLeftNavItem: our Eatery entry into the leftNav.
 */
function EateryLeftNavItem({changeView, handleFilter}) {

  // render our menu item
  return (
    <ListItem icon onPress={()=>changeView()}>
      <Left>
        <Icon name="bonfire" style={{color: 'red'}}/>
      </Left>
      <Body>
        <Text style={{color: 'red'}}>Pool</Text>
      </Body>
      <Right>
        <Button transparent onPress={handleFilter}>
          <Icon active name="options"/>
        </Button>
      </Right>
    </ListItem>
  );
}

const EateryLeftNavItemWithState = withState({
  component: EateryLeftNavItem,
  mapDispatchToProps(dispatch, {fassets}) {// ... fassets available in ownProps (via withFassets() below)
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

export default EateryLeftNavItemWithFassets = withFassets({
  component: EateryLeftNavItemWithState,
  mapFassetsToProps: {
    fassets: '.', // ... introduce fassets into props via the '.' keyword
  }
});

