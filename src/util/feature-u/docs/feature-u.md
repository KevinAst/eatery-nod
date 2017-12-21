# feature-u *(Feature Based Project Organization for React)*

feature-u is a library that facilitates feature-based project
organization for your [react] project.  It assists in organizing your
project by individual features.  There are many good articles that
discuss this topic, but this is a utility that streamlines and
manages the process.

In a nutshell, feature-u:

- **manages all aspects** of the features that comprise an application
  (_things like actions, reducers, components, routes, logic, etc._),

- **configuring the underlying infrastructure** (_e.g. redux,
  redux-logic, router, etc._), 

- and **launches the app**

- making each **feature plug-and-play**, 

- and relagating the mainline to a **single line of code**!

The following benefits are promoted:

 - **Feature Encapsulation** _within it's own isolated implementation_

 - promotes **Cross Feature Communication** _through a publicFace_

 - **minimizes feature dependency order issues** - EVEN in code that
   is expanded in-line

 - supports **feature enablement** _through a run-time switch_

 - provides **App Life Cycle Hooks**, _allowing features to inject
   app-specific initialization, and even introduce components
   into the root of the app_

 - provides [**Feature Based Route
   Management**](#feature-based-route-management) (based on app
   state), _promoting feature-based commponents_

 - facilitates **single-source-of-truth** _within a feature's
   implementation_

 - promotes a **simplified mainline** (i.e. a single line of code)

This truly makes individual **features plug-and-play** within an app.

feature-u is experimental in the sense that it is not yet published
... rather it merely lives in one of my projects ([eatery-nod]) as a
utility.  While it is in fact full featured, it is currently somewhat
narrowly focused ... it is operational for [react-native] apps, built
with [expo], that utilize [redux] and [redux-logic].  Regardless of
whether I decide to spend the time to publish the library, it has
useful concepts that can be *(at minimum)* followed by your project.


## At a Glance

- [Intro](#intro)
- [Feature Aspects](#feature-aspects)
  * [Actions](#actions)
  * [Reducers (state)](#reducers-state)
    - [Sliced Reducers](#sliced-reducers)
  * [Selectors (encapsolating state)](#selectors-encapsolating-state)
  * [Logic](#logic)
  * [Components](#components)
  * [Routes](#routes)
- [Launching Your App](#launching-your-app)
- [Feature Based Route Management](#feature-based-route-management)
- [App Life Cycle Hooks](#app-life-cycle-hooks)
  * [appWillStart](#appwillstart)
  * [appDidStart](#appdidstart)
- [Cross Feature Communication](#cross-feature-communication)
  * [publicFace](#publicface)
  * [App Object](#app-object)
    - [Accessing the App Object](#accessing-the-app-object)
      * [managedExpansion()](#managedexpansion)
      * [App Access Summary](#app-access-summary)
    - [Checking Feature Dependencies (via App)](#checking-feature-dependencies-via-app))
- [Single Source of Truth](#single-source-of-truth)
  * [Feature Name](#feature-name)
  * [Feature State Location](#feature-state-location)
- [API](api.md)
  * [`createFeature()`](api.md#createFeature)
  * [`slicedReducer()`](api.md#slicedReducer)
  * [`managedExpansion()`](api.md#managedExpansion)
  * [`createRoute()`](api.md#createRoute)
  * [`runApp()`](api.md#runApp)


## Intro

Here is a sample directory structure of an app that uses feature-u:

```
src/
  app.js              ... launches app using runApp()

  feature/
    index.js          ... accumulate/promote all app features

    featureA/         ... an app feature
      actions.js
      appDidStart.js
      appWillStart.js
      comp/
        ScreenA1.js
        ScreenA2.js
      index.js        ... promotes featureA object using createFeature()
      logic.js
      publicFace.js
      reducer.js
      route.js

    featureB/         ... another app feature
      ...

  util/               ... common utilies used across all features
    ...
```

Each feature is located in it's own directory, defining it's aspects
(actions, reducers, components, routes, logic, etc.).  It promotes
these aspects through a Feature object (using createFeature()):

**`src/feature/featureA/index.js`**
```js
import {createFeature}  from 'feature-u';
import publicFace       from './publicFace';
import reducer          from './state';
import logic            from './logic';
import route            from './route';
import appWillStart     from './appWillStart';
import appDidStart      from './appDidStart';

export default createFeature({
  name:     'featureA',
  enabled:  true,

  publicFace: {
    api: {
      open:  () => ... implementation omitted,
      close: () => ... implementation omitted,
    },
  },

  reducer,
  logic,
  route,

  appWillStart,
  appDidStart,
});
```

You can see that featureA defines reducers, logic modules, routes,
and does some type of initialization (appWillStart/appDidStart).  It
also promotes a publicFace (open/close) to other features.

The **application mainline**, merely collects all features, and
launches the app by invoking runApp():

**`src/app.js`**
```js
import {runApp}  from 'feature-u';
import features  from './feature';

export default runApp(features);
```

runApp() returns an App object, which accumulates the publicFace of
all features (in named feature nodes), supporting cross-communication
between features:

```js
app: {
  featureA: {
    api: {
      open(),
      close(),
    },
  },
  featureB: {
    ...
  },
}
```



## Feature Aspects

In feature-u, "aspect" is a general term used to refer to the various
ingredients that (when combined) constitute your application.  As an
example, "aspects" may refer to redux elements (actions, reducers,
selectors), UI ingredients (components, routes, etc.), logic modules,
etc, etc, etc.

Some aspects are of interest to feature-u while others are internal
implementation details of a feature.  **feature-u is only concerned
with aspects that are required to manage and configure other
frameworks** (_for example: redux, redux-logic, navigation routers,
etc._).

In essence, aspects are feature-u's plugable wrapper into other
framework/utilities.  feature-u doesn't change these wrapped
frameworks in any way.  You use them in the same way, employing their
promoted APIs.  What aspects accomplishes then is two fold:

  1. It accumulates these framework-specific resources over a cross-cut
     of multiple features, combining them into an all-inclusive 
     application resource.

  2. It (_conveniently_) automatically manages and configures these
     wrapped frameworks, simplifying your application startup process.

Consequently, aspects are packaged separately from feature-u, so you
can "pick and choose" the ones that match your project's run-time
stack.

You can even define your own aspect (_if the one you need doesn't
already exist_), by using feature-u's open and extendable Aspect API.

Let's take a closer look at some example aspects that you may use in
defining a feature, and discuss feature-u's interest in each.

?? refactor this list by: 
   - redux (actions/reducers/selectors)
   - redux-logic
   - Components
   - Navigational Routers

  * [Actions](#actions)
  * [Reducers (state)](#reducers-state)
    - [Sliced Reducers](#sliced-reducers)
  * [Selectors (encapsolating state)](#selectors-encapsolating-state)
  * [Logic](#logic)
  * [Components](#components)
  * [Routes](#routes)


### Actions

Within the [redux] framework,
[actions](https://redux.js.org/docs/basics/Actions.html) are the basic
building blocks that facilitate application activity.  

- Actions follow a pre-defined convention that promote an action type
  and a type-specific payload.

- Actions are dispatched throughout the system (both UI components,
  and logic modules).

- Actions are monitored by reducers (which in turn change state), and
  trigger UI changes.

- Actions are also monitored by logic modules, implementing a variety
  of app-level logic (things like asynchronously gathering server
  resources, and even dispatching other actions).

In general, **actions are considered to be an internal detail of the
feature**, and therefore are **NOT managed by feature-u**.  In other
words, *each feature will define and use it's own set of actions*.

This allows you to manage your actions however you wish.  Best
practices prescribe that actions should be created by [action
creators](https://redux.js.org/docs/basics/Actions.html#action-creators)
(functions that return actions).  It is common to manage your action
creators and action types through a library like [action-u] or
[redux-actions].

With that said, **there are cases where actions need to be promoted
outside of a feature's implementation**.  Say, for example, featureA's
reducer needs to monitor one of featureB's actions, or one of
featureB's logic modules needs to dispatch a featureA action.  When
this happens **the [publicFace](#publicface) feature-u aspect can be
used for this promotion**.  Please note that in consideration of
feature encapsulation, *best practices would strive to minimize the
public promotion of actions outside the feature boundry*.

In regard to actions, one characteristic that must be adhered to is
**action types must to be unique across the entire app**, *because
they are interpreted at an app-level scope*.  This uniqueness is the
responsibility of your implementation, because feature-u does not
inject itself in the action definition process.  This may simply
naturally happen in your implementation.  If however, you wish to
systematically insure this uniqueness, the simplest thing to do is to
**prefix all your action types with the feature name** (*feature-u
guarantees all feature names are unique*).  This has the *added
benefit of readily associating dispatched action flows to the feature
they belong to*.  **Note**: Ideally you could use the feature.name as
a single-source-of-truth, however importing feature from your actions
module is problematic (due to the inner dependency of actions with
other feature aspects).  As a result, you can either duplicate the
name in your action root, or import a separate `featureName` module
(*that simply holds the name*).  Here is an example (using
[action-u]):

**`src/feature/featureA/actions.js`**
```js
import {generateActions} from 'action-u';
import featureName       from './featureName';

export default generateActions.root({
  [featureName]: { // prefix all actions with our feature name, guaranteeing they unique app-wide!
    action1: {     // actions.action1(): Action
                   actionMeta: {},
    },
    action2: {     // actions.action2(): Action
                   actionMeta: {},
    },
    etc...
  },
});
```


### Reducers (state)

Within the [redux] framework,
[reducers](https://redux.js.org/docs/basics/Reducers.html) monitor
actions, changing app state, which in turn triggers UI changes.

Each feature (that maintains state), will define it's own reducer,
maintaining it's own feature-based state (typically a sub-tree of
several items).

While these reducers are opaque assets that maintain state as an
internal detail of the feature, **feature-u is interested in them to
the extent that it must combine all feature states into one overall
appState, and in turn register them to redux**.

Each feature (that maintains state) **promotes it's own reducer
through the `reducer` createFeature() parameter**.

Because reducers may require feature-based context information,
**this parameter can also be a contextCB** - *a function that
returns the reducerFn* (please refer to
[managedExpansion()](#managedexpansion) for more information).


#### Sliced Reducers

Because feature-u must combine the reducers from all features into one
overall appState, it requires that each reducer be embellished through
the `slicedReducer()` function.  This merely injects a slice property
on the reducer function, specifying the location of the reducer within
the top-level appState tree.

As an example, the following definition: 

```js
const currentView = createFeature({
  name:     'currentView',
  reducer:  slicedReducer('view.currentView', currentViewReducer)
  ...
});

const fooBar = createFeature({
  name:     'fooBar',
  reducer:  slicedReducer('view.fooBar', fooBarReducer)
  ...
});
```

Yeilds the following overall appState:

```js
appState: {
  view: {
    currentView {
      ... state managed by currentViewReducer
    },
    fooBar: {
      ... state managed by fooBarReducer
    },
  },
}
```

Another benefit of `slicedReducer()` is that it **also embellishes the
reducer with a standard selector** that returns the slicedState root:

```js
reducer.getSlicedState(appState): slicedState
```

In our case this slicedState root is the featureState root, so this
should be used in all your selectors to further encapsolate this
detail, **employing a single-source-of-truth concept**.  Here is an
example:

```js
                             /** Our feature state root (a single-source-of-truth) */
const getFeatureState      = (appState) => reducer.getSlicedState(appState);

                             /** Is device ready to run app */
export const isDeviceReady = (appState) => getFeatureState(appState).status === 'READY';

... more selectors
```


### Selectors (encapsolating state)

[Selectors](https://gist.github.com/abhiaiyer91/aaf6e325cf7fc5fd5ebc70192a1fa170)
are a best practice which encapsulates the raw nature of the state
shape and business logic interpretation of that state.

Selectors should be used to encapsulate all your state.  Most
selectors should be promoted/used internally within the feature
(defined in close proximity to your reducers).

While feature-u does not directly manage anything about selectors, a
feature may wish to promote some of it's selectors using the
[publicFace](#publicface) feature-u aspect.  Please note that in
consideration of feature encapsulation, *best practices would strive
to minimize the public promotion of feature state (and selectors)
outside the feature boundary*.



### Logic

feature-u assumes the usage of [redux-logic] in managing your business
logic (a solution that is growing in popularity).  The following
article is an introduction (and motivation) for the development of
redux-logic: [Where do I put my business logic in a React-Redux
application](https://medium.com/@jeffbski/where-do-i-put-my-business-logic-in-a-react-redux-application-9253ef91ce1).

Any feature that has business logic **promotes it's own logic modules
through the `logic` createFeature() parameter**.  While logic
modules are opaque functional assets, **feature-u's interest in them
is to merely register them to the redux-logic agent**.

Because logic modules may require feature-based context information,
**this parameter can also be a contextCB** - *a function that
returns the set of logic modules* (please refer to
[managedExpansion()](#managedexpansion) for more information).


### Components

Within the [react] framework,
[components](https://reactjs.org/docs/react-component.html) are the
User Interface (UI) of your app.

In general, **components are considered to be an internal detail of
the feature**, and therefore are **NOT managed by feature-u**.  In
other words, *each feature will define and use it's own set of
components*.

This allows you to manage your components however you wish.  

A feature will typically promote it's top-level screen components
through the feature-u Router (see: [Routes](#routes)).  This is the
primary way in which a feature exposes it's components to the app.

Like other feature aspects, **there may be cases where components need
to be programatically exposed outside of a feature's implementation**.
This typically happens for lower-level utility components.  When this
happens **the [publicFace](#publicface) feature-u aspect can be used
for this promotion**.



### Routes

Each feature (that maintains components) promotes it's top-level
screen components through a `route` createFeature()
parameter, using the createRoute() utility.  

A route is simply a function that reasons about the appState, and
either returns a rendered component, or null to allow downstream
routes the same opportunity.  Basically the first non-null return
wins.

Please refer to the [Feature Based Route
Management](#feature-based-route-management) section for more details.

**NOTE**: Because routes operate on a "first come, first serve" basis,
this is the one aspect that **may dictate the order of your feature
registration**.  With that said, *it is not uncommon for your route logic
to naturally operate independent of this ordering*.


## Launching Your App

Because feature-u has knowledge of the various aspects that comprise
an application, it can easily configure the underlying infrastructure
(e.g. redux, redux-logic, router, etc.) and launch the app.

Features can even inject content in the top-level document hierarchy
(through feature-u's app life-cycle hooks).

As a result, your application mainline merely invokes the `runApp()`
function, passing a collection of features that make up your app.

In other words, your mainline is a single line of code!

**`src/app.js`**
```js
import {runApp}  from 'feature-u';
import features  from './feature';

export default runApp(features);
```

runApp() returns an App object, which accumulates the publicFace of all
features (in named feature nodes), supporting cross-communication
between features.  For this reason, the app object should be exported
by your mainline (_exposing it to various code modules_).

Under the covers, `runApp()` is managing the following details:

- insures uniqueness of all feature names
- interprets feature enablement (i.e. disabling non-active features)
- setup (and return) the App object (promoting all features publicFace)
- manages the expansion of all assets in a controlled way (via `managedExpansion()`)
- configures redux, accumulating all feature reducers into one app reducer (defining one overall appState)
- configures redux-logic, accumulating all feature logic modules
- configures the feature-u router, accumulating all feature routes
- manages app life-cycle hooks found in all features (both `appWillStart()` and `appDidStart()`)
- activates the app by registering the top-level app component to Expo



## Feature Based Route Management

You may be surprised to discover that feature-u introduces it's own
flavor of route management. There are so many router implementations!
Why introduce yet another?

**Don't Worry, Be Happy**

Actually, the feature-u router is a **completely optional aspect**, so
don't be alarmed if you have already settled on your own
route/navigation solution.

You are free to use whatever route/navigation solution that meets your
requirements.
 - You can use the built-in feature-u routes
 - You can use XYZ navigation (_fill in the blank with your chosen solution_)
 - You can even use a combination of feature-u routes and XYZ routes

The only caveat in using another route managements system is that the
XYZ routes will not be an integral part of feature-u, so your feature
encapsulation may be somewhat compromised.  This may or may not be a
concern.  With that said, it is theoretically possible to introduce
your own feature-u extension supporting XYZ routes, which would bring
it back into the realm of "the extended" feature-u.  For now, this
exercise is left up to you, as there are so many route management
solutions.

**feature-u routes**

The **big benefit of the feature-u router** (_should you choose to use it_)
is **it allows a feature to promote it's screens in an encapsulated and
autonomous way**!
The feature-u router is _based on a very simple concept_: **allow the
application state to drive the routes!**

In feature based routing, you will not find the typical "route path to
component" mapping catalog, where (_for example_) some pseudo
`route('signIn')` directive causes the SignIn screen to display, which
in turn causes the system to accommodate the request by adjusting it's
state appropriately.  Rather, the appState is analyzed, and if the
user is NOT authenticated, the SignIn screen is automatically
displayed ... Easy Peasy!

Depending on your perspective, this approach can be **more natural**,
but _more importantly_, **it allows features to promote their own
screens in an encapsulated and autonomous way**!

**Here is how it works:**

Each feature (that maintains components) promotes it's top-level
screen components through a `route` createFeature()
parameter, using the createRoute() utility.  

A route is simply a function that reasons about the appState, and
either returns a rendered component, or null to allow downstream
routes the same opportunity.  Basically the first non-null return
wins.  _If no component is established, the router will fallback to a
splash screen (not typical but could occur in some startup
transition)_.

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
this is the one aspect that **may dictate the order of your feature
registration**.  With that said, *it is not uncommon for your route logic
to naturally operate independent of this ordering*.

**Another important point** is that _feature based routing establishes
a routing precedence_.  As an example, the 'auth' feature can take
"routing precedence" over the 'xyz' feature, by simply resolving to an
appropriate screen until the user is authenticated (say a SignIn
screen or even a splash screen when appropriate).  This means the the
'xyz' feature can be assured the user is authenticated!  You will
never see logic in an 'xyz' screen that redirects to a login screen if
the user is not authenticated.


## App Life Cycle Hooks

Because feature-u is in control of launching the app, application life
cycle hooks can be introduced, allowing features to perform
app-specific initialization, and even introduce components into the
root of the app.

Two hooks are provided through the following feature parameters:

1. [**appWillStart**](#appwillstart) - invoked one time at app startup time
2. [**appDidStart**](#appdidstart)   - invoked one time immediatly after app has started



### appWillStart

The **appWillStart** life-cycle hook is invoked one time at app startup time.

```js
API: appWillStart(app, children): optional-top-level-content (undefined for none)
```

This life-cycle hook can do any type of initialization.  For
example: initialize FireBase.

In addition, this life-cycle hook can optionally supplement the
app's top-level content (using a non-null return).  Typically,
nothing is returned (i.e. undefined).  However any return value is
interpreted as the content to inject at the top of the app, between
the redux Provider and feature-u's Router.  **IMPORTANT**: If you
return top-level content, it is your responsiblity to include the
supplied children in your render.  Otherwise NO app content will be
displayed (because children contains the feature-u Router, which
decides what screen to display).

Here is an example that injects new root-level content:
```js
appWillStart(app, children) {
  ... any other initialization ...
  return (
    <Drawer ...>
      {children}
    </Drawer>
  );
}
```

Here is an example of injecting a new sibling to children:
```js
appWillStart: (app, children) => [React.Children.toArray(children), <Notify key="Notify"/>]
```


### appDidStart

The **appDidStart** life-cycle hook is invoked one time immediatly
after app has started.

```js
API: appDidStart({app, appState, dispatch}): void
```

Because the app is up-and-running at this time, you have access to
the appState and the dispatch function.

A typical usage for this hook is to dispatch some type of bootstrap
action.  Here is a startup feature, that issues a bootstrap action:

```js
appDidStart({app, appState, dispatch}) {
  dispatch( actions.bootstrap() );
}
```



## Cross Feature Communication

Most aspects of a feature are internal to the feature's
implementation.  For example, as a general rule, actions are created
and consumed exclusively by logic and reducers that are internal to
that feature.

However, there are cases where a feature needs to publicly promote
some aspects to another feature.  As an example, featureA may:
 - need to know some aspect of featureB (say some state value through
   a selector),
 - or emit/monitor one of it's actions,
 - or in general anything (i.e. invoke some function that does xyz).

You can think of this as the feature's Public API, and it promotes
cross-communication between features.

A **best practice** is to treat each of your features as isolated
implementations.  As a result, a feature **should never** directly
import resources from other features, **rather** they should utilize
the public feature promotion of the App object (_discussed here_).  In
doing this **a:** only the public aspects of a feature are
exposed/used, and **b:** your features become truly plug-and-play.

Let's see how Cross Communication is accomplished in feature-u:
  * [publicFace](#publicface)
  * [App Object](#app-object)
    - [Accessing the App Object](#accessing-the-app-object)
      * [managedExpansion()](#managedexpansion)
      * [App Access Summary](#app-access-summary)
    - [Checking Feature Dependencies (via App)](#checking-feature-dependencies-via-app))


### publicFace

In feature-u, this cross-feature-communication is accomplished through the
`publicFace` createFeature() parameter.  

A feature can expose whatever it deems necessary through it's `publicFace`.
There are no real constraints on this resource.  It is truly open.
Typically it is a container of functions of some sort.

Here is a suggested sampling:

```js
export default createFeature({
  name:     'featureA',

  publicFace: {

    actions: {   // ... JUST action creators that need public promotion (i.e. NOT ALL)
      open: actions.view.open,
    },
    
    sel: { // ... JUST selectors that need public promotion (i.e. NOT ALL)
      currentView:   selector.currentView,
      isDeviceReady: selector.isDeviceReady,
    },

    api,

  },

  ...
});
```

The following sections discuss how this publicFace is exposed and
accessed.


### App Object

The `publicFace` of all features are accumulated and exposed through
the App object (emitted from runApp()), as follows:
`app.{featureName}.{publicFace}`.

As an example, the sample above can be referenced like this: 

```js
  app.featureA.sel.isDeviceReady(appState)
```

#### Accessing the App Object

The App object can be accessed in several different ways.

1. The simplest way to access the App object is to merely import it.

   Your application mainline exports the `runApp()` return
   value ... which is the App object.

   **`src/app.js`**
   ```js
   import {runApp}  from 'feature-u';
   import features  from './feature';

   export default runApp(features);
   ```

   Importing the app object is a viable technique for run-time
   functions (_such as UI Components_), where the code is
   **a:** _not under the direct control of feature-u, and_
   **b:** _executed after all aspect expansion has completed._

   The following example is a UI Component that displays a
   `deviceStatus` obtained from an external `startup` feature
   ... **_accessing the app through an import:_**
   
   ```js
   import app from '~/app';
   
   function ScreenA({deviceStatus}) {
     return (
       <Container>
         ...
         <Text>{deviceStatus}</Text>
         ...
       </Container>
     );
   }
   
   export default connectRedux(ScreenA, {
     mapStateToProps(appState) {
       return {
         deviceStatus: app.device.sel.deviceStatus(appState),
       };
     },
   });
   ```

2. Another way to access the App object is through the programmatic
   APIs of feature-u, where the `app` object is supplied as a
   parameter.
   
   * route:
     ```js
     routeCB(app, appState): rendered-component (null for none)
     ```
   * app life-cycle hooks:
     ```js
     appWillStart(app, children): optional-top-level-content
     appDidStart({app, appState, dispatch}): void                        
     ```
   
   * logic hooks:
     ```js
     createLogic({
       ...
       transform({getState, action, app}, next) {
         ...
       },
       process({getState, action, app}, dispatch, done) {
         ...
       }
     })
     ```

3. There is a third technique to access the App object, that provides
   **early access** _during code expansion time_, that is provided
   through the [managedExpansion()](#managedexpansion) function (_see
   next section_).


#### managedExpansion()

In the previous discussion, we detailed two ways to access the App
object, and referred to a third technique (_discussed here_).

There are two situations that make accessing the `app` object
problematic, which are: **a:** _in-line code expansion (where the app
may not be fully defined)_, and **b:** _order dependencies (across
features)_.

To illustrate this, the following logic module is monitoring an action
defined by an external feature (see `*1*`).  Because this `app`
reference is made during code expansion time, the import will not
work, because the `app` object has not yet been fully defined.  This
is a timing issue.

```js
import app from '~/app'; // *1*

export const myLogicModule = createLogic({

  name: 'myLogicModule',
  type: String(app.featureB.actions.fooBar), // *1* app NOT defined during in-line expansion
  
  process({getState, action}, dispatch, done) {
    ... 
  },

});
```

When aspect definitions require `app` references at code expansion
time, you can wrap the aspect definition in a contextCB function.  In
other words, your aspects can either be the actual aspect itself (ex:
a reducer), or a function that returns the aspect (e.g. the reducer).

Your callback function should conform to the following signature:

```js
contextCB(app): feature-aspect
```

When this is done, feature-u will invoke the contextCB in a controlled
way, passing the `app` object in a parameter.

To accomplish this, you must embellish your contextCB using the
`managedExpansion()` function.  The reason for this is that feature-u
must be able to distinguish a contextCB function from other functions
(ex: reducers).

Here is the same example (from above) that that fixes our
problem by replacing the `app` import with managedExpansion():

```js
                             // *1* we replace app import with managedExpansion()
export const myLogicModule = managedExpansion( (app) => createLogic({

  name: 'myLogicModule',
  type: String(app.featureB.actions.fooBar), // *1* app now is fully defined
  
  process({getState, action}, dispatch, done) {
    ... 
  },

}) );
```

Because the contextCB() is invoked in a controlled way (by feature-u),
the supplied `app` parameter is guaranteed to be defined (_issue
**a**_).  Not only that, but the supplied `app` object is guaranteed to
have all features publicFace definitions resolved (_issue **b**_).

**_SideBar_**: A secondary reason `managedExpansion()` may be used
(_over and above app injection during code expansion_) is to **delay
code expansion**, which can avoid issues related to (_legitimate but
somewhat obscure_) circular dependencies.


#### App Access Summary

To summarize our discussion of how to access the App object, it is
really very simple:

1. Simply import the app (_for run-time functions outide the control
   of feature-u_).

2. Use the app parameter supplied through feature-u's programmatic
   APIs (_when using route, live-cycle hooks, or logic hooks_).

3. Use the app parameter supplied through `managedExpansion()`
   (_when app is required during in-line expansion of code_).

Accessing Feature Resources in a seamless way is a **rudimentary
benefit of feature-u** that alleviates a number of problems in your
code, making your features truly plug-and-play.

**NOTE**: It is possible that a module may be using more than one of
these techniques.  As an example a logic module may have to use
`managedExpansion()` to access app at expansion time, but is also
supplied app as a parameter in it's functional hook.  This is
perfectly fine, as they will be referencing the exact same app object
instance.















#### Checking Feature Dependencies (via App)

In regard to feature dependencies, the App object can be used to
determine if a feature is present or not.  If a feature does not
exist, or has been disabled, the corresponding `app.{featureName}`
will NOT exist.

 - It could be that `featureA` will conditionally use `featureB` if it
   is present.

   ```js
   if (app.featureB) {
     ... do something featureB related
   }
   ```

 - It could be that `featureC` unconditionally requires that `featureD`
   is present.  This can be checked in the `appWillStart()` life cycle
   hook.

   ```js
   appWillStart(app, children) {
     assert(app.featureD, '***ERROR*** I NEED featureD');
   }
   ```


## Single Source of Truth

Each of your feature implementations should strive to follow the
single-source-of-truth principle.  In doing this, a single line
modification can propagate to many areas of your implementation.

Please note that this discussion is merely a **best practice**,
because it is up to you to implement (i.e. feature-u is not in control
of this).

In regard to features, there are two single-source items of interest:
 - [Feature Name](#feature-name)
 - [Feature State Location](#feature-state-location)


### Feature Name

The featureName is a critical item that can be used throughout your
feature implementation to promote a consistent feature identity.

A key aspect of the featureName is that feature-u guarantees it's
uniqueness.  As a result, it can be used to qualify the identity of
several feature aspects.  For example:

 - prefixing all action types with featureName, guaranteeing their uniqueness app-wide
 - prefixing all logic module names with featureName, helps to identify where that module lives
 - depending on the context, the featureName can be used as the root of your feature state's shape

While the feature name is part of the Feature object (emitted from
createFeature()), there are race conditions where the Feature object
will not be defined (during in-line code expansion).

As a result, a best practice is to expose the featureName as a
constant, through a `featureName.js` mini-meta module that is
"importable" in all use-cases (i.e. a single-source-of-truth).

**`src/feature/foo/featureName.js`**
```js
/**
 * Expose our featureName through a mini-meta module that is
 * "importable" in all use-cases (a single-source-of-truth).
 */
export default 'foo';
```

### Feature State Location

Because feature-u relies on `slicedReducer()`, a best practice is to
use the reducer's embellished selector to qualify your feature state
root in all your selector definitions.  As a result the slice
definition is maintained in one spot.

Here is an example: 

```js
                             /** Our feature state root (a single-source-of-truth) */
const getFeatureState      = (appState) => reducer.getSlicedState(appState);

                             /** Is device ready to run app */
export const isDeviceReady = (appState) => getFeatureState(appState).status === 'READY';

... more selectors
```

## API

  * [`createFeature()`](api.md#createFeature)
  * [`slicedReducer()`](api.md#slicedReducer)
  * [`managedExpansion()`](api.md#managedExpansion)
  * [`createRoute()`](api.md#createRoute)
  * [`runApp()`](api.md#runApp)


[react]:          https://reactjs.org/
[react-native]:   https://facebook.github.io/react-native/
[redux-logic]:    https://github.com/jeffbski/redux-logic
[eatery-nod]:     https://github.com/KevinAst/eatery-nod
[expo]:           https://expo.io/
[redux]:          http://redux.js.org/
[action-u]:       https://www.npmjs.com/package/action-u
[redux-actions]:  https://www.npmjs.com/package/redux-actions
