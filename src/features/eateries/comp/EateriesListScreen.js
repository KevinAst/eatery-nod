import React         from 'react';
import {withFassets} from 'feature-u';
import withState     from '../../../util/withState';
import {TouchableWithoutFeedback} from 'react-native';
import {Body,
        Button,
        Container,
        Content,
        Footer,
        FooterTab,
        Header,
        Icon,
        Left,
        List,
        ListItem,
        Right,
        Text,
        Title}           from 'native-base';
import SplashScreen      from '../../../util/comp/SplashScreen';
import commonStyles      from '../../commonStyles';
import _eateriesAct      from '../actions';
import * as _eateriesSel from '../state';

/**
 * EateriesListScreen displaying a set of eateries (possibly filtered).
 */
function EateriesListScreen({curUser, openLeftNav, filteredEateries, filter, showDetail, handleSpin}) {

  if (!filteredEateries) {
    return <SplashScreen msg="... waiting for pool entries"/>;
  }

  let currentDistance = -1;

  function listContent() {
    const content = [];
    filteredEateries.forEach( eatery => {
      // optionally supply sub-header when ordered by distance
      if (filter.sortOrder === 'distance' && eatery.distance !== currentDistance) {
        currentDistance = eatery.distance;
        content.push((
          <ListItem itemDivider key={`subheader${currentDistance}`}>
            <Text style={{color: 'red'}}>
              {currentDistance} mile{currentDistance===1?'':'s'}
              <Text note> (as the crow flies)</Text>
            </Text>
          </ListItem>
        ));
      }
      // supply our primary entry content
      content.push((
        <TouchableWithoutFeedback key={eatery.id}
                                  onPress={()=>showDetail(eatery.id)}>
          <ListItem>
            <Body>
              <Text>
                {eatery.name}
                <Text note> ({eatery.distance} mile{eatery.distance===1?'':'s'})</Text>
              </Text>
              <Text note>{eatery.addr}</Text>
            </Body>
          </ListItem>
        </TouchableWithoutFeedback>
      ));
    });
    return content;
  }

  return (
    <Container style={commonStyles.container}>
      <Header>
        <Left>
          <Button transparent onPress={openLeftNav}>
            <Icon name="menu"/>
          </Button>
        </Left>
        <Body>
          <Title>Pool <Text note>({curUser.pool})</Text></Title>
          {filter.distance && <Text note>(within {filter.distance} mile{filter.distance===1?'':'s'})</Text>}
        </Body>
        <Right/>
      </Header>
      <Content>
        <List>
          { listContent() }
        </List>
      </Content>
      <Footer>
        <FooterTab>
          <Button vertical
                  onPress={handleSpin}>
            <Icon style={commonStyles.icon} name="color-wand"/>
            <Text style={commonStyles.icon}>Spin</Text>
          </Button>
        </FooterTab>
      </Footer>

    </Container>
  );
}

const EateriesListScreenWithState = withState({
  component: EateriesListScreen,
  mapStateToProps(appState, {fassets}) { // ... fassets available in ownProps (via withFassets() below)
    return {
      filteredEateries: _eateriesSel.getFilteredEateries(appState),
      filter:           _eateriesSel.getListViewFilter(appState),
      curUser:          fassets.sel.curUser(appState),
    };
  },
  mapDispatchToProps(dispatch) {
    return {
      showDetail(eateryId) {
        //console.log(`xx showDetail for ${eateryId}`);
        dispatch( _eateriesAct.viewDetail(eateryId) );
      },
      handleSpin() {
        dispatch( _eateriesAct.spin() );
      },
    };
  },
});

export default EateriesListScreenWithFassets = withFassets({
  component: EateriesListScreenWithState,
  mapFassetsToProps: {
    fassets:     '.',            // introduce fassets into props via the '.' keyword
    openLeftNav: 'openLeftNav',  // openLeftNav()
  }
});
