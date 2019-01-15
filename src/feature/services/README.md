# services directory

The **services** directory is a categorized collection of **"Service Related"**
features _(some of which are "mockable")_:

- [**authService**](authService/README.md):            a persistent authentication service (retaining active user)
- [**discoveryService**](discoveryService/README.md):  retrieves restaurant information from a geographical data source, emitting Discovery/Eatery objects
- [**eateryService**](eateryService/README.md):        a persistent "Eateries" DB service, monitoring real-time Eatery DB activity
- [**firebaseInit**](firebaseInit/README.md):          initialize the eatery-nod firebase DB
- [**locationService**](locationService/README.md):    a GPS location service
