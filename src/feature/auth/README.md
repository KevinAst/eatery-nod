# auth feature

The 'auth' feature promotes complete user authentication by:

 - gathering user credentials from authentication screens (route,
   logic)

 - managing "Auto SignIn" through retained device credentials (logic)

 - managing interaction with authentication services (logic, reducer),

 - fetches user profile as part of the SignIn process (logic,
   reducer),

 - deactivates app-specific features by promoting SplashScreen until
   the the device is ready (route)

## State Transition

For a high-level overview of how actions, logic, and reducers interact
together to maintain this feature's state, please refer to the [State
Transition](README.txt) diagram.
