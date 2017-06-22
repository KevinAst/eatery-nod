import React    from 'react';
import RN       from 'react-native';
import * as NB  from 'native-base';

/**
 * Splash Screen when there is nothing else to display.
 *
 * NOTE: Because this screen contains text which uses native-base
 *       fonts, it cannot be displayed on initial entry ... in this
 *       case use the <Expo.AppLoading/> component.
 */
export default function Splash() {
  return (
    <NB.Container style={styles.container}>
      <NB.Header>
        <NB.Body>
          <NB.Title>Eatery Nod</NB.Title>
        </NB.Body>
      </NB.Header>
      <NB.Content contentContainerStyle={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
        <RN.Image style={{width: 100, height: 100}}
                  source={require('../../assets/icons/eatery.png')}/>
        <NB.Spinner color='blue'/>
      </NB.Content>
    </NB.Container>
  );
}

const styles = {
  container: {
    paddingTop: 24, // prevent overlay of device NavBar (at least on Android)
  },
};
