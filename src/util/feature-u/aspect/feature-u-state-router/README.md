# feature-u-state-router *(StateRouter integration in feature-u)*

**feature-u-state-router** promotes the `route` Aspect (a **feature-u**
plugin) that facilitates **StateRouter** integration to your
features _(also referred to as: **Feature Routes**)_.

**StateRouter** _(or **Feature Routes**)_ is _based on a very simple
concept_: **allow the application state to drive the routes!** It
operates through a series of registered functional callback hooks,
which determine the active screen based on an analysis of the the
overall appState.  This is particulary useful in feature-based
routing, because each feature can promote their own UI components in
an encapsulated and autonomous way!  Because of this,
**feature-u-state-router** is a preferred routing solution for
**feature-u**.

**SideBar:**
<ul>

**feature-u** is a utility that facilitates feature-based project
organization for your [react] project. It helps organize your
project by individual features.  **feature-u** is extendable. It
operates under an open plugin architecture where Aspects integrate
feature-u to other framework/utilities that match your specific
run-time stack.

**feature-u-state-router** is your **feature-u** integration point to
**StateRouter** _(or **Feature Routes**)_!

</ul>

?? TODO: DOC AI: insure feature-u links are valid ONCE feature-u docs have stabilized!

## At a Glance

- [Install](#install)
- [Usage](#usage)
- [A Closer Look](#a-closer-look)
  * [Why Feature Routes?](#why-feature-routes)
  * [How Feature Routes Work](#how-feature-routes-work)
  * [Feature Order and Routes](#feature-order-and-routes)
  * [Routing Precedence](#routing-precedence)
- [Configuration](#configuration)
  * [fallbackElm](#fallbackelm)
  * [componentWillUpdateHook](#componentwillupdatehook)
- [Interface Points](#interface-points)
  * [Input](#input)
  * [Exposure](#exposure)
  * [Supplementing rootAppElm DOM](#supplementing-rootappelm-dom)
- [API](api.md)
  * [`routeAspect`](api.md#routeAspect)
  * [`featureRoute({content, [priority]}): routeCB`](api.md#featureRoute)
  * [`routeCB({app, appState}): reactElm || null`](api.md#routeCB)


## Install

```shell
npm install --save feature-u-state-router
```

**Please Note**: The following **peerDependencies** are in effect:
- **feature-u** (_??ver_)
- **react** (_??ver_)
- **react-redux** (_??ver_)
- **NOTE**: the **state-router** dependancy is built-in

## Usage

1. Register the **feature-u-state-router** `routeAspect` through
   **feature-u**'s `launchApp()` (_see: **NOTE 1** below_).

   **myAppMain.js**
   ```js
   import {launchApp}    from 'feature-u';
   import {routeAspect}  from 'feature-u-state-router'; // *** NOTE 1 ***
   import SplashScreen   from './wherever/SplashScreen';
   import features       from './feature';

   // see: Configuration section (below)
   routeAspect.fallbackElm = <SplashScreen msg="I'm trying to think but it hurts!"/>;

   export default launchApp({

     aspects: [
       routeAspect,    // *** NOTE 1 ***
       ... other Aspects here
     ],

     features,

     registerRootAppElm(rootAppElm) {
       ReactDOM.render(rootAppElm,
                       getElementById('myAppRoot'));
     }
   });
   ```

2. Now you can specify a `route` `createFeature()` named parameter
   (_in any of your features that promote UI screens_) referencing the
   routeCB hook specified through the `featureRoute()` function.

   Here is a route for a `startup` feature that simply promotes a
   SplashScreen until the system is ready (_see **NOTE** below_):

   **src/feature/startup/index.js**
   ```js
   import React            from 'react';
   import {createFeature}  from 'feature-u';
   import {featureRoute, 
           PRIORITY}       from 'feature-u-state-router';
   import * as selector    from './state';
   import SplashScreen     from '~/util/comp/SplashScreen';
   
   export default createFeature({

     name:   'startup',

     route: featureRoute({  // *** NOTE *** 
       priority: PRIORITY.HIGH,
       content({app, appState}) {
         if (!selector.isDeviceReady(appState)) {
           return <SplashScreen msg={selector.getDeviceStatusMsg(appState)}/>;
         }
         return null;  // system IS ready ... allow downstream routes to activate
       },
     }),

     ... snip snip
   });
   ```

The `route` content can either be a single `featureRoute()` or an
array with varying priorities.

Hopefully this gives you the basic idea of how
**feature-u-state-router** operates.  The following sections develop a
more thorough understanding of StateRouter concepts.  _Go forth and
compute!_


## A Closer Look

You may be surprised to discover that **feature-u** recomends it's own
flavor of route management. There are so many!  Why introduce yet
another?

As it turns out, **feature-u** does not dictate any one
navigation/router solution.  You are free to use whatever
route/navigation solution that meets your requirements.
 - You can use the recomended **Feature Routes** _(i.e. this package)_
 - You can use XYZ navigation (_fill in the blank with your chosen solution_)
 - You can even use a combination of **Feature Routes** routes and XYZ routes

Let's take a closer look at **Feature Routes**.


### Why Feature Routes?

The **big benefit** of **Feature Routes** (_should you choose to use
them_) is that **it allows a feature to promote it's screens in an
encapsulated and autonomous way**!

**Feature Routes** are _based on a very simple concept_: **allow the
application state to drive the routes!**

In feature based routing, you will not find the typical "route path to
component" mapping catalog, where (_for example_) some pseudo
`route('signIn')` directive causes the SignIn screen to display, which
in turn causes the system to accommodate the request by adjusting it's
state appropriately.  Rather, the appState is analyzed, and if the
user is NOT authenticated, the SignIn screen is automatically
displayed ... Easy Peasy!

Depending on your perspective, this approach can be **more natural**,
but _more importantly_ (once again), **it allows features to promote
their own screens in an encapsulated and autonomous way**!


### How Feature Routes Work

Each feature (that maintains UI components) promotes it's top-level
screens through a `route` `createFeature()` parameter, using the
`featureRoute()` utility.

A `route` is simply a function that reasons about the appState, and
either returns a rendered component, or null to allow downstream
routes the same opportunity.  Basically the first non-null return
wins.  If no component is established, the router will revert to a
configured fallback - **a Splash Screen of sorts** _(not typical but
may occur in some startup transitions)_.

The `route` directive contains one or more function callbacks
(`routeCB()`), as defined by the `content` callback parameter of
`featureRoute()`, with the following signature:
```
  routeCB({app, appState}): rendered-component (null for none)
```

A single routeCB may be specified, or an array of routeCBs with
varying priorities.  Priorities are integer values that are used to
minimize a routes registration order.  Higher priority routes are
given precedence (i.e. executed before lower priority routes).  Routes
with the same priority are executed in their registration order.

While priorities can be used to minimize (or even eliminate) the
registration order, typically an application does in fact rely on
registration order and can operate using a small number of priorities
(_the PRIORITY constants are available for your convenience_).

Priorities are particularly useful within feature-u, where a given
feature is provided one registration slot, but requires it's route
logic to execute in different priorities.  In that case, the feature
can promote multiple routes (an array) each with their own priority.

Here is a route for an `Eateries` feature (_displaying a list of
restaurants_) that employs two seperate routeCBs with varying
priorities:

**`src/feature/startup/index.js`**
```js
import React               from 'react';
import {createFeature}     from 'feature-u';
import {featureRoute,
        PRIORITY}          from 'feature-u-state-router';
import * as sel            from './state';
import featureName         from './featureName';
import EateriesListScreen  from './comp/EateriesListScreen';
import EateryDetailScreen  from './comp/EateryDetailScreen';
import EateryFilterScreen  from './comp/EateryFilterScreen';
import SplashScreen        from '~/util/comp/SplashScreen';

export default createFeature({

  name: featureName,

  route: [
    featureRoute({
      priority: PRIORITY.HIGH,
      content({app, appState}) {
        // display EateryFilterScreen, when form is active (accomplished by our logic)
        // NOTE: this is done as a priority route, because this screen can be used to
        //       actually change the view - so we display it regarless of the state of
        //       the active view
        if (sel.isFormFilterActive(appState)) {
          return <EateryFilterScreen/>;
        }
      }
    }),

    featureRoute({
      content({app, appState}) {

        // allow other down-stream features to route, when the active view is NOT ours
        if (app.currentView.sel.getView(appState) !== featureName) {
          return null;
        }
        
        // ***
        // *** at this point we know the active view is ours
        // ***
        
        // display anotated SplashScreen, when the spin operation is active
        const spinMsg = sel.getSpinMsg(appState);
        if (spinMsg) {
          return <SplashScreen msg={spinMsg}/>;
        }
        
        // display an eatery detail, when one is selected
        const selectedEatery = sel.getSelectedEatery(appState);
        if (selectedEatery) {
          return <EateryDetailScreen eatery={selectedEatery}/>;
        }
        
        // fallback: display our EateriesListScreen
        return <EateriesListScreen/>;
      }
    }),

  ],

  ... snip snip
});
```


### Feature Order and Routes

The `route` aspect **may be one _rare_ characteristic that dictates
the order of your feature registration**.  It really depends on the
specifics of your app, and how much it relies on **route priorities**.

With that said, _it is not uncommon for your route logic to naturally
operate independent of your feature registration order_.



### Routing Precedence

A **fundamental principle** to understand is that **feature based
routing establishes a Routing Precedence _as defined by your
application state_**!

As an example, an `'auth'` feature can take "routing precedence" over
the `'xyz' feature, by simply resolving to an appropriate screen until
the user is authenticated (say a SignIn screen or an authorization
splash screen when appropriate).  

This means the the `'xyz'` feature can be assured the user is
authenticated!  You will never see logic in an `'xyz'` screen that
redirects to a login screen if the user is not authenticated.


## Configuration

### fallbackElm

`routeAspect.fallbackElm` (**REQUIRED**):

Before you can use `routeAspect` you must first configure the
`fallbackElm` representing a SplashScreen (of sorts) when no routes
are in effect.  Simply set it as follows:

```js
import {routeAspect} from 'feature-u-state-router';
import SplashScreen  from './wherever/SplashScreen';
...
routeAspect.fallbackElm = <SplashScreen msg="I'm trying to think but it hurts!"/>;
...
```

This configuration is **required**, because it would be problematic
for **feature-u-state-router** to devise a default _(it doesn't know
your app layout, or for that matter if you are a web or react-native
application)_.


### componentWillUpdateHook

`routeAspect.componentWillUpdateHook` (**OPTIONAL**):

You can optionally specify a `StateRouter` componentWillUpdate
life-cycle hook (a function that, when defined, will be invoked during
the componentWillUpdate react life-cycle phase).  _This was initially
introduced in support of ReactNative animation._ Simply set it as
follows:

```js
import {routeAspect}     from 'feature-u-state-router';
import {LayoutAnimation} from 'react-native';
...
routeAspect.componentWillUpdateHook = () => LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
...
```

## Interface Points

**feature-u-state-router** accumulates all the routes from the various
features of your app, and registers them to **StateRouter**.  The
**Aspect Interface** to this process (_i.e. the inputs and outputs_)
are documented here.

### Input

- The input to **feature-u-state-router** are routing callback hooks.
  This is specified by each of your features (_that maintain UI
  components_) through the `Feature.route` property, referencing
  functions defined by the `featureRoute()` utility.

### Exposure

- **feature-u-state-router** promotes your app's active screen by
  injecting the `StateRouter` component at the at the root of your
  application DOM.  This allows your `route` hooks to specify the
  active screen, based on your application state.

### Supplementing rootAppElm DOM

Normally, features that wish to supplement the rootAppElm DOM do so
through the `Feature.appWillStart()` life-cycle hook.  This is
problematic when using the `routeAspect`.  This section discusses why
this is the case, and highlights an alternative solution.

As mentioned above, the `routeAspect` promotes itself by injecting the
`StateRouter` component at the root of your application DOM.

It is important to understand that the `StateRouter` component does NOT
support children.  The reason for this is that it ultimately dictates
the complete rendered content through it's `routeCB` API, so
statically defined children do NOT have meaning.

Actually the rootAppElm DOM is ultimately defined through a
combination of Feature/Aspect DOM injections in the following order:

 1. `Feature.appWillStart({app, curRootAppElm})`
 2. `Aspect.injectRootAppElm(app, activeFeatures, curRootAppElm)`

As a result, if a Feature attempts to supplement the rootAppElm
(through the normal `Feature.appWillStart()` life-cycle hook), the
`routeAspect` will reject it because it does not support children.

To resolve this, the `routeAspect` defines it's own Feature API to
supplement the rootAppElm DOM, that is seeded with the `StateRouter`
component:

```js
 + Feature.injectRootAppElmForStateRouter(app, curRootAppElm): newRootAppElm
```

If you are using the `routeAspect`, this API should be used to
supplement the rootAppElm DOM.


## API

  * [`routeAspect`](api.md#routeAspect)
  * [`featureRoute({content, [priority]}): routeCB`](api.md#featureRoute)
  * [`routeCB({app, appState}): reactElm || null`](api.md#routeCB)





[react]:            https://reactjs.org/
