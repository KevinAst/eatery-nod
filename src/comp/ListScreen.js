import React        from 'react';
import {connect}    from 'react-redux'
import * as nb      from 'native-base';
import commonStyles from './commonStyles';

/**
 * ListScreen displaying a set of eateries (possibly filtered).
 */
function ListScreen(p) {
  return (
    <nb.Container style={commonStyles.container}>
      <nb.Header>
        <nb.Left>
          <nb.Button transparent>
            <nb.Icon name='menu'/>
          </nb.Button>
        </nb.Left>
        <nb.Body>
          <nb.Title>List View</nb.Title>
        </nb.Body>
        <nb.Right/>
      </nb.Header>
      <nb.Content>
        <nb.Text>Signed in as: {p.appState.user} ... Yee Haa!</nb.Text>
      </nb.Content>
      <nb.Footer>
        <nb.FooterTab>
          <nb.Button full>
            <nb.Title>List View Footer</nb.Title>
          </nb.Button>
        </nb.FooterTab>
      </nb.Footer>
    </nb.Container>
  );
};

export default connect(
  state => { // mapStateToProps
    return {
      appState: state // ?? temp
    };
  })(ListScreen);
