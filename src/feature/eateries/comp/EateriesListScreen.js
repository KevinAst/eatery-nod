import React         from 'react';
import connectRedux  from '../../../util/connectRedux';
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
        Title}       from 'native-base';
import SplashScreen  from '../../../util/comp/SplashScreen';
import commonStyles  from '../../commonStyles';
import actions       from '../actions';
import * as sel      from '../state';
import app           from '../../../app';

/**
 * EateriesListScreen displaying a set of eateries (possibly filtered).
 */
function EateriesListScreen({entries, dbPool, filter, showDetail, handleSpin}) {

  if (!entries) {
    return <SplashScreen msg="... waiting for pool entries"/>;
  }

  const eateries = entries.map( eateryId => dbPool[eateryId] );

  let currentDistance = -1;

  function listContent() {
    const content = [];
    eateries.forEach( eatery => {
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
          <Button transparent onPress={app.leftNav.open}>
            <Icon name="menu"/>
          </Button>
        </Left>
        <Body>
          <Title>Pool</Title>
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

export default connectRedux(EateriesListScreen, {
  mapStateToProps(appState) {
    return {
      entries:  sel.getListViewEntries(appState),
      dbPool:   sel.getDbPool(appState),
      filter:   sel.getListViewFilter(appState),
    };
  },
  mapDispatchToProps(dispatch) {
    return {
      showDetail(eateryId) {
        //console.log(`xx showDetail for ${eateryId}`);
        dispatch( actions.viewDetail(eateryId) );
      },
      handleSpin() {
        dispatch( actions.spin() );
      },
    };
  },
});
