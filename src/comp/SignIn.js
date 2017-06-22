import React        from 'react';
import {connect}    from 'react-redux'
import * as nb      from 'native-base';
import commonStyles from './commonStyles';

const SignIn = (p) => {
  return (
    <nb.Container style={commonStyles.container}>
      <nb.Header>
        <nb.Left>
          <nb.Button transparent>
            <nb.Icon name='menu'/>
          </nb.Button>
        </nb.Left>
        <nb.Body>
          <nb.Title>Sign In</nb.Title>
        </nb.Body>
        <nb.Right/>
      </nb.Header>
      <nb.Content>
        <nb.Text>Sign in please!</nb.Text>
        <nb.Button success onPress={p.signedIn}>
          <nb.Text>Sign In</nb.Text>
        </nb.Button>
      </nb.Content>
      <nb.Footer>
        <nb.FooterTab>
          <nb.Button full>
            <nb.Title>Sign In Footer</nb.Title>
          </nb.Button>
        </nb.FooterTab>
      </nb.Footer>
    </nb.Container>
  );
};

export default connect(
  state => {    // mapStateToProps
    return {
      appState: state // ?? temp
    };
  },
  dispatch => { // mapDispatchToProps
    return {
      signedIn: ()=> dispatch({type: 'login.success'}),
    };
  }
)(SignIn);
