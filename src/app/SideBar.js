import React        from 'react';
import {connect}    from 'react-redux';
import {TouchableWithoutFeedback} from 'react-native';
import {Body,
        Container,
        Content,
        Header,
        List,
        ListItem,
        Text,
        Title,
        View}       from 'native-base';
import commonStyles from '../comp/commonStyles';
import actions      from '../actions';

/**
 * SideBar: our left-nav sidebar
 */
function SideBar({systemReady, changeView}) {

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
          <TouchableWithoutFeedback onPress={()=>changeView('eateries')}>
            <ListItem>
              <Text>Eateries</Text>
            </ListItem>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={()=>changeView('discovery')}>
            <ListItem>
              <Text>Discover other Eateries</Text>
            </ListItem>
          </TouchableWithoutFeedback>
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
  _drawer._root.close();
}

export default connect(

  // mapStateToProps()
  (appState) => {
    return {
      systemReady: appState.systemReady,
    };
  },

  // mapDispatchToProps()
  (dispatch) => {
    return {
      changeView(view) {
        dispatch( actions.view.change(view) );
        setTimeout(() => closeSideBar(), 1); // delay so as to have new view up when sidebar closes (HACK)
        if (view==='discovery') { // ?? temp HACK for now
          const tempFilter = {
            location: [38.752209, -89.986610], // Glen Carbon
            radius:   10,                      // 10 miles
         // searchText: 'collensville', // 'fazzis'
          };
          dispatch( actions.discovery.retrieve(tempFilter) );
        }
      },
    };
  }

)(SideBar);
