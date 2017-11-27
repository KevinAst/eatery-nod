# eatery-nod app

The **'eatery-nod'** application is composed from following **features**:
 - **'logActions'**: logs all dispatched actions and resulting state
 - **'firebase'**:   initializes the google firebase service
 - **'device'**:     initializes the device for use by the app, and promotes a **device api** abstraction
 - **'auth'**:       promotes complete user authentication
 - **'leftNav'**:    promotes the app-specific Drawer/SideBar on the app's left side
 - **'view'**:       maintains the currentView with get/set cross-feature communication bindings
 - **'eateries'**:   manages and promotes the eateries view
 - **'sandbox'**:    promotes a variety of interactive tests, used in development, that can easily be disabled
