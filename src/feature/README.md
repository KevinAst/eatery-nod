# eatery-nod app

The **eatery-nod** application is composed of the following **features**:

 - [**auth**](auth/README.md):               promotes complete user authentication ?? move to init
 - [**init**](init/README.md):               a categorized collection of **"Initialization Related"** features
   - [**device**](init/device/README.md):    initializes the device for use by the app
 - [**views**](views/README.md):             a categorized collection of **"UI Related"** features
   - [**leftNav**](views/leftNav/README.md):         promotes the app-specific Drawer/SideBar on the app's left side
   - [**currentView**](views/currentView/README.md): maintains the currentView with get/set cross-feature communication bindings
   - [**eateries**](views/eateries/README.md):       manages and promotes the eateries view
   - [**discovery**](views/discovery/README.md):     manages and promotes the discovery view
 - [**services**](services/README.md):                              a categorized collection of **"Service Related"** features _(some of which are "mockable")_
    - [**authService**](services/authService/README.md):            a persistent authentication service (retaining active user)
    - [**deviceService**](services/deviceService/README.md):        promotes several device related services
    - [**discoveryService**](services/discoveryService/README.md):  retrieves restaurant information from a geographical data source, emitting Discovery/Eatery objects
    - [**eateryService**](services/eateryService/README.md):        a persistent "Eateries" DB service, monitoring real-time Eatery DB activity
    - [**firebaseInit**](services/firebaseInit/README.md):          initialize the eatery-nod firebase DB
 - [**logActions**](logActions/README.md):   logs all dispatched actions and resulting state
 - [**sandbox**](sandbox/README.md):         promotes a variety of interactive tests, used in development, that can easily be disabled
