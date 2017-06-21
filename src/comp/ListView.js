import React     from 'react';
import {connect} from 'react-redux'
import * as nb   from 'native-base';

const ListView = (p) => {
  return (
    <nb.Container style={styles.container}>
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


const styles = {
  container: {
    paddingTop: 24, // prevent overlay of device NavBar (at least on Android)
  },
};

export default connect(
  state => { // mapStateToProps
    return {
      appState: state // ?? temp
    };
  })(ListView);
