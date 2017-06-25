import React        from 'react';
import {connect}    from 'react-redux'
import {Body,
        Button,
        Container,
        Content,
        Footer,
        FooterTab,
        Header,
        Icon,
        Left,
        Right,
        Text,
        Title}      from 'native-base';
import commonStyles from './commonStyles';

/**
 * ListScreen displaying a set of eateries (possibly filtered).
 */
function ListScreen(p) {
  return (
    <Container style={commonStyles.container}>
      <Header>
        <Left>
          <Button transparent>
            <Icon name='menu'/>
          </Button>
        </Left>
        <Body>
          <Title>List View</Title>
        </Body>
        <Right/>
      </Header>
      <Content>
        <Text>Signed in as: {p.appState.user} ... Yee Haa!</Text>
      </Content>
      <Footer>
        <FooterTab>
          <Button full>
            <Title>List View Footer</Title>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
};

export default connect(
  appState => { // mapStateToProps
    return {
      appState: appState, // ?? temp
    };
  })(ListScreen);
