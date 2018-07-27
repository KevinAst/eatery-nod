import React           from 'react';
import connectRedux    from '../../../util/connectRedux';
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

export default connectRedux(EateryLeftNavItem, {
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
