import React        from 'react';
import RN           from 'react-native';
import * as NB      from 'native-base';
import PropTypes    from 'prop-types';
import commonStyles from './commonStyles';

/**
 * FatalScreen displays a msg to the user, when there is nothing left to do.
 * 
 * L8TR: we should NOT be using any native-base fonts (so it can be
 *       displayed without resources)
 *       ... I thought I would have to replace NB.Title/NB.Text with RN.Text 
 *           HOWEVER the NB seems to be working EVEN prior to font loads ... hmmm
 * 
 * NOTE: Because this screen contains text which uses native-base
 *       fonts, it cannot be displayed on initial entry.  In this
 *       case use the <Expo.AppLoading/> component.
 */
export default function FatalScreen({msg}) {
  return (
    <NB.Container style={commonStyles.container}>
      <NB.Header>
        <NB.Body>
          <NB.Title>Eatery Nod (Error)</NB.Title>
        </NB.Body>
      </NB.Header>
      <NB.Content contentContainerStyle={{flex: 1, alignItems: 'center', justifyContent:'center'}}>
        <RN.Image style={{width: 100, height: 100}}
                  source={require('../../assets/icons/eatery.png')}/>
        <NB.Icon name="md-sad"   style={{fontSize: 80, color: 'red'}}/>
        <NB.Text>{msg}</NB.Text>
      </NB.Content>
    </NB.Container>
  );
}

FatalScreen.propTypes = {
  msg: PropTypes.string.isRequired
};

FatalScreen.defaultProps = {
  msg: 'A problem has occurred.'
};
