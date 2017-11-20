********************************************************************************
* 'auth' feature
********************************************************************************

The 'auth' feature promotes complete user authentication by:

 - gathering user credentials from authentication screens (route,
   logic)

 - managing "Auto SignIn" through retained device credentials (logic)

 - managing interaction with authentication services (logic, reducer),

 - fetches user profile as part of the SignIn process (logic,
   reducer),

 - deactivates app-specific features by promoting SplashScreen until
   the the device is ready (route)



********************************************************************************
* State Transition
********************************************************************************


action                                           logic                                                          reducer
----------------------------------------------   ------------------------------------------------------------   ------------------------------
auth                                             > logic/auth.js                                               
 .bootstrap()                                        checkDeviceCredentials:                                    - NONE
                                                       async: api.device.fetchCredentials() via localStorage() 
                                                              - YES: dispatch .haveDeviceCredentials(encodedCredentials)  
                                                              - NO:  dispatch .noDeviceCredentials()           
                                                              - ERR: dispatch .fail(err)                       
                                                     autoSignIn:                                               
    .haveDeviceCredentials(encodedCredentials)         dispatch signIn(email, pass)                             - retain auth.deviceCredentials
                                                     manualSignIn:                                             
    .noDeviceCredentials()                             dispatch signIn.open()                                   - set    auth.deviceCredentials='NONE' << UI will route to SignInScreen
                                                                                                               
                                                                                                               
                                                   ?? L8TR                                                     
                                                 > logic/auth.js                                               
 .signUp()                                             ??                                                       - ??
                                                                                                               
                                                 > logic/auth.js                                               
                                                     signIn:                                                   
 .signIn(email, pass)                                  async: firebase.auth()                                   - NONE
                                                              .signInWithEmailAndPassword(email, pass)         
                                                              - SUCCESS: dispatch .complete(user)              
                                                                         store credentials                     
                                                              - FAIL:    dispatch( .signIn.open(action, msg) );   
                                                                                                               
    .complete(user)                                  supplementSignInComplete:                                 
                                                       transform():                                            
                                                         supplement action.userProfile (blocking via transform())  
                                                       process():                                              
                                                         dispatch actions.profile.changed(userProfile)         
                                                                                                               
                                                                                                                - set auth.user.status signedIn/signedInUnverified (based on action.user.emailVerified)
                                                                                                                - set auth.user.email from action.user.email
                                                                                                               
                                                     signInCleanup:                                            
                                                       dispatch signIn.close()                                 
                                                                                                               
                                                                                                               
                                                                                                               
    .checkEmailVerified()                            checkEmailVerified:                                        - auth.user.status signedIn/signedInUnverified (based on action.user.emailVerified)
                                                       transform: do firebase.auth().currentUser.reload()      
                                                                  .then( inject action firebase.currentUser )  
                                                                                                               
    .resendEmailVerification()                       resendEmailVerification:                                   - NONE
                                                       transform: firebase.auth().currentUser.sendEmailVerification()  
                                                                                                               
                                                                                                               
                                                                                                               
    > iForm logic (auto-generated)               > iForm logic (auto-generated)                                 > iForm logic (auto-generated)
    .open([domain] [,formMsg])                                                                                 
    .fieldChanged(fieldName, value)                                                                            
    .fieldTouched(fieldName)                                                                                   
    .process(values, domain)                                                                                   
                                                 > logic/auth.js                                               
                                                     processSignIn:                                            
                                                       dispatch .signIn(email, pass)                           
      .reject(msgs)                                                                                            
    .close()                                                                                                   
                                                                                                               
?? send original email - on SignUp                                                                             
                                                                                                               
                                                 > logic/auth.js                                               
 .signOut()                                          signOut:                                                   - set appState.auth.user status:'signedOut', email:null, name:null, pool:null
                                                       async: firebase.auth()                                   - ?? what about eateries and discovery (may want to clear them when user signs back in)
                                                              .signOut()                                       
                                                                SWALLOW error (or just log it)                 
                                                       remove device credentials                               
