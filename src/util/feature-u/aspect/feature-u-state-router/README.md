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

**feature-u** is a utility that facilitates feature-based project
organization for your [react] project. It helps organize your project by
individual features.  **feature-u** is extendable. It operates under an
open plugin architecture where Aspects provide the feature integration
to other framework/utilities that match your specific run-time stack.

**feature-u-state-router** is your **feature-u** integration point to
**StateRouter** _(or **Feature Routes**)_!

?? TODO: DOC AI: insure feature-u links are valid ONCE feature-u docs have stabilized!

## At a Glance

- [Install](#install)
- [Usage](#usage)
- [A Closer Look](#a-closer-look)
  * [Why Feature Routes?](#why-feature-routes)
  * [How Feature Routes Work](#how-feature-routes-work)
  * [Key Benefit](#key-benefit)
- [Configuration](#configuration)
  * [fallbackElm](#fallbackelm)
  * [componentWillUpdateHook](#componentwillupdatehook)
- [Interface Points](#interface-points)
  * [Input](#input)
  * [Exposure](#exposure)
  * [Supplementing rootAppElm DOM](#supplementing-rootappelm-dom)
- [API](api.md)
  * [`routeAspect`](api.md#routeAspect)
  * [`createRoute`](api.md#createRoute)

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
   route callback hook specified through the `createRoute()` function
   (_see: **NOTE** below_).

   **src/feature/startup/index.js**
   ```js
   import {createFeature}  from 'feature-u';
   
   export default createFeature({
     name:   'startup',

     route: createRoute({  // *** NOTE *** 
       priorityContent(app, appState) {
         if (!selector.isDeviceReady(appState)) {
           return <SplashScreen msg={selector.getDeviceStatusMsg(appState)}/>;
         }
         return null;  // system IS ready ... allow downstream routes to activate
       },
     }),

     ... other props here
   });
   ```

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
`createRoute()` utility.

A `route` is simply a function that reasons about the appState, and
either returns a rendered component, or null to allow downstream
routes the same opportunity.  Basically the first non-null return
wins.  If no component is established, the router will revert to a
configured fallback _(not typical but may occur in some startup
transitions)_.

The `route` directive contains one or two function callbacks
(routeCB), with the following signature:
```
  routeCB(app, appState): rendered-component (null for none)
```

One or two routeCBs can be registered, one with priority and one without.
The priority routeCBs are given precedence across all registered routes
before the non-priority routeCBs are invoked.

Here is a route for a `startup` feature that simply promotes a
SplashScreen until the system is ready:

**`src/feature/startup/index.js`**
```js
export default createFeature({
  name: 'startup',

  publicFace: {
    ...
  },

  reducer,
  logic,
  route: createRoute({
    priorityContent(app, appState) {
      if (!selector.isDeviceReady(appState)) {
        return <SplashScreen msg={selector.getDeviceStatusMsg(appState)}/>;
      }
      return null;  // system IS ready ... allow downstream routes to activate
    },
  }),

  appWillStart,
  appDidStart,
});
```

**NOTE**: Because routes operate on a "first come, first serve" basis,
this is one aspect that **may dictate the order of your feature
registration**.  With that said, *it is not uncommon for your route
logic to naturally operate independent of this ordering*.

### Key Benefit

A **fundemental princible** to understand is that **feature based
routing establishes a routing precedence**.  As an example, the 'auth'
feature can take "routing precedence" over the 'xyz' feature, by
simply resolving to an appropriate screen until the user is
authenticated (say a SignIn screen or even a splash screen when
appropriate).  This means the the 'xyz' feature can be assured the
user is authenticated!  You will never see logic in an 'xyz' screen
that redirects to a login screen if the user is not authenticated.


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
  functions defined by the `createRoute()` utility.

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
the complete rendered content through it's `routeCB()` API, so
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
  * [`createRoute`](api.md#createRoute)






[react]:            https://reactjs.org/
