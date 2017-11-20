# auth feature

The **'auth'** feature promotes complete user authentication, by
accomplishing the following:

 - disables app-specific features until the user is fully
   authenticated - by promoting various authentication screens until
   authentication is complete **(route)**

 - interacts with authentication services **(logic, reducer)**

 - gathers user credentials from various authentication screens
   **(route, logic)**

 - manages "Auto SignIn" through retained device credentials
   **(logic)**

 - fetches user profile as part of the SignIn process **(logic,
   reducer)**

## State Transition

For a high-level overview of how actions, logic, and reducers interact
together to maintain this feature's state, please refer to the [State
Transition](StateTransition.txt) diagram.
