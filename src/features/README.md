# eatery-nod app

The **eatery-nod** application is composed of the following **features**:

 - [**init**](init/README.md):               a categorized collection of **"Initialization Related"** features
   - [**device**](init/device/README.md):    initializes the device for use by the app
   - [**auth**](init/auth/README.md):        promotes complete user authentication
 - [**views**](views/README.md):             a categorized collection of **"UI Related"** features
   - [**eateries**](views/eateries/README.md):       manages and promotes the eateries view
   - [**discovery**](views/discovery/README.md):     manages and promotes the discovery view
   - [**leftNav**](views/leftNav/README.md):         promotes the app-specific Drawer/SideBar on the app's left side
   - [**currentView**](views/currentView/README.md): maintains the currentView state with get/set cross-feature bindings
 - [**services**](services/README.md):                             a categorized collection of **"Service Related"** features _(that are "mockable")_
   - [**deviceService**](services/deviceService/README.md):        promotes several device related services
   - [**authService**](services/authService/README.md):            a persistent authentication service (retaining active user)
   - [**eateryService**](services/eateryService/README.md):        a persistent "Eateries" DB service, monitoring real-time Eatery DB activity
   - [**discoveryService**](services/discoveryService/README.md):  retrieves restaurant information from a geographical data source, emitting Discovery/Eatery objects
 - [**support**](support/README.md):                a categorized collection of **"Support Utility"** features
   - [**bootstrap**](support/bootstrap/README.md):        provide critical-path app initialization through the `'bootstrap.*'` use contract
   - [**firebaseInit**](support/firebaseInit/README.md): promote a utility function to initialize the eatery-nod firebase DB
 - [**diag**](diag/README.md):                      a categorized collection of **"Diagnostic Related"** features
   - [**logActions**](diag/logActions/README.md):   logs all dispatched actions and resulting state
   - [**sandbox**](diag/sandbox/README.md):         promotes a variety of interactive tests, used in development, that can easily be disabled
