import Expo from 'expo';

/**
 * Load device resources needed to run our system.
 * 
 * @return {promise} a promise indicating the resource load is complete.
 */
export function loadResources() {

  // L8TR: Expo.Font.loadAsync() docs are lacking, assume it returns a promise that will eventually error
  //       ... https://docs.expo.io/versions/v17.0.0/sdk/font.html#exponentfontloadasync

  // L8TR: May need to wrap in our own promise ESPECIALLY at a point when multiple resources are needed.

  // NativeBase UI needs these custom fonts
  return Expo.Font.loadAsync({
    'Roboto':        require('native-base/Fonts/Roboto.ttf'),
    'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
  });
}
