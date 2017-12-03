# eatery-nod app

The **'eatery-nod'** application is composed from following **features**:
 - [**'device'**](device/README.md):         initializes the device for use by the app, and promotes a **device api** abstraction
 - [**'auth'**](auth/README.md):             promotes complete user authentication
 - [**'leftNav'**](leftNav/README.md):       promotes the app-specific Drawer/SideBar on the app's left side
 - [**'view'**](view/README.md):             maintains the currentView with get/set cross-feature communication bindings
 - [**'eateries'**](eateries/README.md):     manages and promotes the eateries view
 - [**'discovery'**](discovery/README.md):   manages and promotes the discovery view
 - [**'firebase'**](firebase/README.md):     initializes the google firebase service
 - [**'logActions'**](logActions/README.md): logs all dispatched actions and resulting state
 - [**'sandbox'**](sandbox/README.md):       promotes a variety of interactive tests, used in development, that can easily be disabled
