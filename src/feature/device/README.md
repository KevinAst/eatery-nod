# device feature

The **'device'** feature initializes the device for use by our app, by
accomplishing the following:

 - dispatches the device bootstrap action that kicks off the entire
   app **(appDidStart)**

 - performs initialization: platform-setup, notify **(appWillStart)**

 - loads device resources (fonts, geo location), triggered by
   bootstrap action **(logic, action, reducer)**

 - monitors the device initialization progress, syncing the device
   status **(logic, action, reducer)**

 - displays SplashScreen until the the device is ready **(route)**

 - starts authorization process when our device is ready **(logic)**
   ?? REPLACE with emit notification: deviceInitializationComplete


## State Transition

For a high-level overview of how actions, logic, and reducers interact
together to maintain this feature's state, please refer to the [State
Transition](StateTransition.txt) diagram.
