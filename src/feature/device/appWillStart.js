import platformSetup  from './init/platformSetup';

/**
 * An app-level life-cycle hook, initializing our feature by:
 *  - performing platform-specific setup (iOS/Android)
 */
export default function appWillStart({app, curRootAppElm}) {
  // platform-specific setup (iOS/Android)
  platformSetup();
}
