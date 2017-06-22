import {UIManager} from 'react-native';

/**
 * Expose function to perform platform-specific setup (i.e. iOS/Android).
 */
export default function platformSetup() {

  // setting UIManager Flag in order to get LayoutAnimation work on android!
  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

}
