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


## POOP

<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;border-color:#aabcfe;}
.tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#aabcfe;color:#669;background-color:#e8edff;}
.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:#aabcfe;color:#039;background-color:#b9c9fe;}
.tg .tg-baqh{text-align:center;vertical-align:top}
.tg .tg-mb3i{background-color:#D2E4FC;text-align:right;vertical-align:top}
.tg .tg-lqy6{text-align:right;vertical-align:top}
.tg .tg-6k2t{background-color:#D2E4FC;vertical-align:top}
.tg .tg-yw4l{vertical-align:top}
</style>

<table class="tg">
  <tr>
    <th class="tg-baqh" colspan="3">State Transition</th>
  </tr>
  <tr>
    <td class="tg-6k2t">action</td>
    <td class="tg-6k2t">logic</td>
    <td class="tg-6k2t">reducer</td>
  </tr>
  <tr>
    <td class="tg-yw4l"><pre>
auth                                          
 .bootstrap()                                 
                                              
                                              
                                              
                                              
                                              
    .haveDeviceCredentials(encodedCredentials)
                                              
    .noDeviceCredentials()                    
    </pre></td>
    <td class="tg-yw4l">
      Swimming
    </td>
    <td class="tg-lqy6">
    1:30
    </td>
  </tr>
</table>

## State Transition


action                                         | logic                                                        | reducer
---------------------------------------------- | ------------------------------------------------------------ | ------------------------------
`  This        `                               | `  I          `                                              |
`    IS        `                               | `    HOPE     `                                              |
`      A       `                               | `      IT     `                                              |
`        TEST  `                               | `        Works`                                              |
                                               |                                                              |
auth                                           | > logic/auth.js                                              |
 .bootstrap()                                  |     checkDeviceCredentials:                                  | - NONE
                                               |       async: api.device.fetchCredentials() via localStorage()|
                                               |              - YES: dispatch .haveDeviceCredentials(encodedCredentials) |
                                               |              - NO:  dispatch .noDeviceCredentials()          |
                                               |              - ERR: dispatch .fail(err)                      |
                                               |     autoSignIn:                                              |
    .haveDeviceCredentials(encodedCredentials) |       dispatch signIn(email, pass)                           | - retain auth.deviceCredentials
                                               |     manualSignIn:                                            |
    .noDeviceCredentials()                     |       dispatch signIn.open()                                 | - set    auth.deviceCredentials='NONE' << UI will route to SignInScreen
                                               |                                                              |
                                               |                                                              |
                                               |   ?? L8TR                                                    |
                                               | > logic/auth.js                                              |
 .signUp()                                     |       ??                                                     | - ??
                                               |                                                              |
                                               | > logic/auth.js                                              |
                                               |     signIn:                                                  |
 .signIn(email, pass)                          |       async: firebase.auth()                                 | - NONE
                                               |              .signInWithEmailAndPassword(email, pass)        |
                                               |              - SUCCESS: dispatch .complete(user)             |
                                               |                         store credentials                    |
                                               |              - FAIL:    dispatch( .signIn.open(action, msg) );  |
                                               |                                                              |
    .complete(user)                            |     supplementSignInComplete:                                |
                                               |       transform():                                           |
                                               |         supplement action.userProfile (blocking via transform()) |
                                               |       process():                                             |
                                               |         dispatch actions.profile.changed(userProfile)        |
                                               |                                                              |
                                               |                                                              | - set auth.user.status signedIn/signedInUnverified (based on action.user.emailVerified)
                                               |                                                              | - set auth.user.email from action.user.email
                                               |                                                              |
                                               |     signInCleanup:                                           |
                                               |       dispatch signIn.close()                                |
                                               |                                                              |
                                               |                                                              |
                                               |                                                              |
    .checkEmailVerified()                      |     checkEmailVerified:                                      | - auth.user.status signedIn/signedInUnverified (based on action.user.emailVerified)
                                               |       transform: do firebase.auth().currentUser.reload()     |
                                               |                  .then( inject action firebase.currentUser ) |
                                               |                                                              |
    .resendEmailVerification()                 |     resendEmailVerification:                                 | - NONE
                                               |       transform: firebase.auth().currentUser.sendEmailVerification() |
                                               |                                                              |
                                               |                                                              |
                                               |                                                              |
    > iForm logic (auto-generated)             | > iForm logic (auto-generated)                               | > iForm logic (auto-generated)
    .open([domain] [,formMsg])                 |                                                              |
    .fieldChanged(fieldName, value)            |                                                              |
    .fieldTouched(fieldName)                   |                                                              |
    .process(values, domain)                   |                                                              |
                                               | > logic/auth.js                                              |
                                               |     processSignIn:                                           |
                                               |       dispatch .signIn(email, pass)                          |
      .reject(msgs)                            |                                                              |
    .close()                                   |                                                              |
                                               |                                                              |
?? send original email - on SignUp             |                                                              |
                                               |                                                              |
                                               | > logic/auth.js                                              |
 .signOut()                                    |     signOut:                                                 | - set appState.auth.user status:'signedOut', email:null, name:null, pool:null
                                               |       async: firebase.auth()                                 | - ?? what about eateries and discovery (may want to clear them when user signs back in)
                                               |              .signOut()                                      |
                                               |                SWALLOW error (or just log it)                |
                                               |       remove device credentials                              |
