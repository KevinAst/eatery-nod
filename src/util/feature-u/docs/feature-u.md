# feature-u *(Feature Based Project Organization for React)*

feature-u is a library that facilitates feature-based project
organization for your [react] project.  It assists in organizing your
project by individual features.  There are many good articles that
discuss this topic, but I wanted a utility that streamlines and
manages the process.

Essentially, feature-u accumulates all features (and their aspects)
that comprise an app (ex: actions, reducers, components, routes,
logic, etc.), managing and registering these items to the appropriate
concerns (ex: redux, redux-logic, routes, etc.), and then launches the
app, relegating your mainline to a single line of code.  The following
benefits are promoted:

 - Feature encapsulation within it's own isolated implementation
 - Inner communication between features (through a public API)
 - Eliminates feature dependency order issues - EVEN in code that
   is expanded in-line
 - Feature enablement/disablement (through a run-time switch)
 - Application life cycle hooks, allowing features to inject
   app-specific initialization, and even introduce components
   into the root of the app
 - Feature-based route management (based on app state), promoting
   feature-based commponents
 - Facilitates single-source-of-truth (within a feature's implementation)
 - A simplified mainline (i.e. a single line of code)

**This truly makes individual features plug-and-play within an app.**

feature-u is experimental in the sense that it is not yet published
... rather it merely lives in one of my projects ([eatery-nod]) as a
utility.  While it is in fact full featured, it is currently somewhat
narrowly focused ... it is operational for [react-native] apps, built
with [expo], that utilize [redux] and [redux-logic].  Regardless of
whether I decide to spend the time to publish the library, it has
useful concepts that can be *(at minimum)* followed by your project.


## At a Glance

- [Intro](#intro)
- [A Closer Look](#a-closer-look)
  * [Feature Aspects](#feature-aspects)
    - [Actions](#actions)
    - [Reducers (state)](#reducers-state)
    - [Selectors (encapsolating state)](#selectors-encapsolating-state)
    - [Logic](#logic)
    - [Components](#components)
    - [Routes](#routes)
    - [Public API](#public-api)
    - [App Life Cycle Hooks](#app-life-cycle-hooks)
  * [Feature Resources](#feature-resources)
    - [Accessing Feature Resources](#accessing-feature-resources)
    - [injectContext()](#injectcontext)
    - [Access Summary](#access-summary)

- [API](#api)
  * [IFormMeta](#iformmeta)
    - registrar
      * [formActionGenesis](#iformmetaregistrarformactiongenesis)
      * [formLogic](#iformmetaregistrarformlogic)
      * [formReducer](#iformmetaregistrarformreducer)
    - [formStateSelector](#iformmetaformstateselector)
    - [IForm](#iformmetaiform)


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
      publicAPI.js
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
import publicAPI        from './publicAPI';
import reducer          from './state;
import logic            from './logic';
import route            from './route';
import appWillStart     from './appWillStart';
import appDidStart      from './appDidStart';

export default createFeature({
  name:     'featureA',
  enabled:  true,

  publicAPI: {
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
also promotes a public API (open/close) to other features.

The **application mainline**, merely collects all features, and
launches the app by invoking runApp():

**`src/app.js`**
```js
import {runApp}  from 'feature-u';
import features  from './feature';

export default runApp(features);
```

runApp() returns an App object, which accumulates the public API of
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




## A Closer Look

Let's take a closer look at feature-u ...


### Feature Aspects

In feature-u, "aspect" is a general term used to refer to the various
ingredients that, when combined, constitute your app.  For example,
"aspects" can refer to actions, reducers, components, routes, logic,
etc.

Let's take a closer look at the various aspects that make up a
feature, and discover how feature-u manages these items.


#### Actions

Within a [redux] framework,
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
this happens **the [Public API](#public-api) feature-u aspect can be
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


#### Reducers (state)

Within a [redux] framework,
[reducers](https://redux.js.org/docs/basics/Reducers.html) monitor
actions, changing app state, which in turn triggers UI changes.

Each feature (that maintains state), will define it's own reducer,
maintaining it's own feature-based state (typically a sub-tree of
several items).

While these reducers are opaque assets that maintain state as an
internal detail of the feature, **feature-u is interested in them to
the extent that it must combine all feature states into one overall
app state, and in turn register them to redux**.

Each feature (that maintains state) **promotes it's own reducer through a
`feature.reducer` createFeature() parameter**.  

By default, feature-u injects each reducer into the overall app state
using a property defined from the `feature.name`.  As an example, if
you have two features, named featureA/featureB, your appState would
appear as follows:

```js
appState: {
  featureA: {
    ... state managed by featureA.reducer
  },
  featureB: {
    ... state managed by featureB.reducer
  },
}
```

You can however explicitly control this location by using the
shapedReducer() utility, which embellishes the reducer with a shape
property - a federated namespace (delimited by dots) specifying the
exact location of the state.  As an example, if featureA's reducer was
embellished with `shapedReducer(reducer, 'views.currentView')`, your
appState would appear as follows:

```js
appState: {
  views: {
    currentView {
      ... state managed by featureA.reducer
    },
  },
  featureB: {
    ... state managed by featureB.reducer
  },
}
```

Another benefit of `shapedReducer()` is that it also embellishes the
reducer with a standard selector, that returns the featureState root,
further isolating this detail in an encapsulation:

```js
reducer.getShapedState(appState): featureState
```

**Please Note** that feature-u guarantees that `shapedReducer()` is
embellished on all it's reducers, so you can rely on
`feature.reducer.getShapedState(appState)` to ALWAYS be available!

**There are cases where some feature state needs to be promoted outside of
a feature's implementation**.  When this happens,
[selectors](https://gist.github.com/abhiaiyer91/aaf6e325cf7fc5fd5ebc70192a1fa170)
should be used, which encapsulates the raw nature of the state shape
and business logic interpretation of that state.  These selectors can
be promoted through the [Public API](#public-api) feature-u aspect.
Please note that in consideration of feature encapsulation, *best
practices would strive to minimize the public promotion of feature
state outside the feature boundary*.

Because reducers may require feature-based context information,
**this parameter can also be a contextCallback** - *a function that
returns the reducerFn* (please refer to
[injectContext()](#injectcontext) for more information).


#### Selectors (encapsolating state)

[Selectors](https://gist.github.com/abhiaiyer91/aaf6e325cf7fc5fd5ebc70192a1fa170)
are a best practice which encapsulates the raw nature of the state
shape and business logic interpretation of that state.

Selectors should be used to encapsulate all your state.  Most
selectors should be promoted/used internally within the feature
(defined in close proximity to your reducers).

While feature-u does not directly manage anything about selectors, a
feature may wish to promote some of it's selectors using the [Public
API](#public-api) feature-u aspect.  Please note that in consideration
of feature encapsulation, *best practices would strive to minimize the
public promotion of feature state (and selectors) outside the feature
boundary*.



#### Logic

feature-u assumes the usage of [redux-logic] in managing your business
logic (a solution that is growing in popularity).  The following
article is an introduction (and motivation) for the development of
redux-logic: [Where do I put my business logic in a React-Redux
application](https://medium.com/@jeffbski/where-do-i-put-my-business-logic-in-a-react-redux-application-9253ef91ce1).

Any feature that has business logic **promotes it's own logic modules
through the `feature.logic` createFeature() parameter**.  While logic
modules are opaque functional assets, **feature-u's interest in them
is to merely register them to the redux-logic agent**.

Because logic modules may require feature-based context information,
**this parameter can also be a contextCallback** - *a function that
returns the set of logic modules* (please refer to
[injectContext()](#injectcontext) for more information).


#### Components

Within a [react] framework,
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
happens **the [Public API](#public-api) feature-u aspect can be used
for this promotion**.



#### Routes

Each feature (that maintains components) promotes it's top-level
screen components through a `feature.route` createFeature()
parameter, using the createRoute() utility.

The Route object contains one or two function callbacks (routeCB), with
the following signature:
```
  routeCB(app, appState): rendered-component (null for none)
```

The routeCB reasons about the supplied appState, and either returns a
rendered component, or null to allow downstream routes the same
opportunity.  Basically the first non-null return wins.

One or two routeCBs can be registered, one with priority and one without.
The priority routeCBs are given precedence across all registered routes
before the non-priority routeCBs are invoked.

Here is a route for a `startup` feature that simply promotes a
SplashScreen until the system is ready:

**`src/feature/startup/index.js`**
```js
imports ... omitted for brevity
export default createFeature({
  name: 'startup',

  publicAPI: {
    ...
  },

  reducer,
  logic,
  route: priorityContent({
    content(app, appState) {
      if (!isDeviceReady(appState)) {
        return <SplashScreen msg={getDeviceStatusMsg(appState)}/>;
      }
      return null;
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

**SideBar**: As you can see, **feature-u provides it's own Router
implementation**.  This is something you may not have expected, given
the popularity of various routers.  The reason for this is I wanted
the app-level redux state to directly drive the screen routes, rather
than an external router dictate a route, from which the app state must
sync.  This just seems more natural to me.  This is what the feature-u
Router accomplishes.  *With that said, I am open to the possibility
that I may be missing something here* :-)


#### Public API

Many aspects of a feature are internal to the feature's
implementation.  For example, most actions are created and consumed
exclusively by logic/reducers that are internal to the feature.

However, other aspects of a feature may need to be exposed, to promote
cross-communication between features.  For example, featureA may need
to know some aspect of featureB (ex: some state through a selector),
or emit one of it's actions, or in general anything (ex: invoke some
function that does xyz).

This cross-communication is accomplished through the
`feature.publicAPI` createFeature() parameter.  This promotes an item
of any type (typically an object containing functions) and is exposed
through the feature-u app (emitted from runApp()).

You can think of publicAPI as your feature's public API.

Here is a suggested sampling:

**`src/feature/featureA/index.js`**
```js
export default createFeature({
  name:     'featureA',

  publicAPI: {
    actions: {   // ... expose JUST actions that needs public access (not all)
      open: actions.view.open,
      etc(),
    },
    
    selectors: { // ... expose JUST state that needs public access (not all)
      currentView: (appState) => ... implementation omitted,
      deviceReady: (appState) => ... implementation omitted,
      etc(appState),
    },

    api: {
      open:  () => ... implementation omitted,
      close: () => ... implementation omitted,
    },

    anyThingElseYouNeed(),  ... etc, etc, etc
  },

  reducer,
  logic,
  route,

  appWillStart,
  appDidStart,
});
```

The above sample is promoted through the feature-u app (returned from
runApp()), as `app.{featureName}`.  The app object can be accessed in
a number of ways (see: [Accessing Feature
Resources](#accessing-feature-resources)), but is typically exported
from your app.js.  Here is a sample usage:

**`src/feature/featureB/someModule.js`**
```js
  import app from './your-app-import'; // exported from runApp()
  ...
  app.featureA.selectors.currentView(appState)
```

Please note that if a feature can be disabled, the corresponding
app.{featureName} will NOT exist.  External features can use this
aspect to dynamically determine if the feature is active or not.
```js
  import app from './your-app-import';
  ...
  if (app.featureA) {
    do something featureA related
  }
```

Because publicAPI may require feature-based context information,
**this parameter can also be a contextCallback** - *a function that
returns the PublicAPI object* (please refer to
[injectContext()](#injectcontext) for more information).


#### App Life Cycle Hooks

Because feature-u is in control of starting the app, application life
cycle hooks can be introduced, allowing features to perform
app-specific initialization, and even introduce components into the
root of the app.

Two hooks are provided through the following feature parameters:

1. **appWillStart** - invoked one time at app startup time.

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
   
2. **appDidStart** - invoked one time immediatly after app has started.
   
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



### Feature Resources

Aspect definitions need to access various feature resources within
their implemenation.

Not all resources accumulated by feature-u are "digestable" by
application code.  Most feature-u aspects are merely opaque assets
that are registered to various utilities, and not directly reasoned
about by application code.  The "digestable" feature resources
include:

 1. feature name (for internal consistancy)

    An example of this, is you may wish to prefix all of your logic
    module names with the feature name: `feature.name`

 2. feature state root (again, for internal consistancy)

    Because feature-u knows where the feature state lives (using
    shapedReducer()) a standard selector can be used to consistenly
    locate it: `feature.reducer.getShapedState(appState)`

 3. feature publicAPI (for cross feature communication), things like
    - actions
    - selectors
    - API
    - etc.

From this list, the **first two items** can be classified as
**internal resources**, and is promoted through the Feature object.
In other words, they are resources for a given feature, defined by and
used in the feature definition.  This is employing a
single-source-of-truth concept.  As an example, if the feature name
changes or it's state location moves, this can be reflected in one
place (i.e. the Feature object).

The **third item** is considered an **external resource**, and is
available through feature-u's [Public API](#public-api), provided
through the App object (*promoting cross feature communication*).


#### Accessing Feature Resources

There are several ways to access feature resources:

- Within feature-u's programatic APIs, the `app` object is supplied as a
  parameter.

  * route:
    ```js
    routeCB(app, appState): rendered-component (null for none)
    ```
  * app life-cycle functions:
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

- For other cases, the simplest way to access Feature Resources is to
  merely import the feature or app (cooresponding to internal/externall
  access).  This actually works well for run-time functions (such as
  Component rendering), where the code is executed after all aspect
  expansion has completed.

  The following example is a component that is displaying a
  `deviceStatus` obtained from an external 'startup' feature using
  it's public API ... by simply importing app:

  ```js
  import app from '../../../app';
  
  function ScreenA({deviceStatus}) {
    return (
      <Container>
        <Header>
          <Body>
            <Title>Screen A</Title>
          </Body>
          <Right>
            <Text>
              {deviceStatus}
            </Text>
          </Right>
        </Header>
        <Content>
          ...
        </Content>
      </Container>
    );
  }
  
  export default connectRedux(ScreenA, {
    mapStateToProps(appState) {
      return {
        deviceStatus: app.startup.selectors.deviceStatus(appState),
      };
    },
  });
  ```

With that said, **there are two issues that make access to these
resources problematic** (*which are addressed by*
[`injectContext()`](#injectcontext) **discussed below**):

 1. in-line expansion of code

    In some cases, this resource access is required by code that is
    expanded in-line, making it problematic as to when the resource is
    available.

 2. order dependancies (across features)

    The last thing you want to be concerned about are timing issues
    regarding when a resource has been resolved (i.e. expanded) and
    available for use.  This is especially true for code that is
    expanded in-line.

The following example is a logic module definition, highlighting
several problems with importing feature/app:

**`src/feature/featureA/logic.js`**
```js
import feature from '.';                         // *1*
import app     from '../../app';

export const startApp = createLogic({

  name: `${feature.name}.myLogicModuleName`,     // *2*
  type: String(app.featureB.actions.fooBar),     // *3*
  
  process({getState, action}, dispatch, done) {
    dispatch( app.featureC.actions.fooBee() );   // *4*
    done();
  },
});
```

 - `*1*`: importing feature/app has it's limitations (keep reading)

 - `*2*`: we want to use a single-source-of-truth by appending our
   feature name to all of our logic modules, HOWEVER `feature` is NOT
   yet defined (from our import) because this code is being
   interpreted at in-line expansion time

 - `*3*`: we want to monitor a different feature's action (using
   feature-u's publicAPI), but have the same problem highlighted in
   point `*2*`, because `app` is NOT yet defined (via our import)
   because (again) this code is being interpreted at in-line expansion
   time

 - `*4*`: we want to dispatch a different feature's action (using
   feature-u's publicAPI).  Because we are within the process()
   function (outside of the scope of in-line expansion), this should
   work.  HOWEVER, what if featureC is expanded AFTER featureA?  This
   is problematic!
   

**SOLUTION**:

feature-u provides mechnisms that eliminate issues related to feature
dependancy order, EVEN references found in code that are expanded
in-line.  **feature-u addresses both of these issues (above) by:**

 - providing a technique to inject feature context (both App and
   Feature) into the code definition (at code expansion time)
   ... please refer to [`injectContext()`](#injectcontext) (below).

 - controlling the expansion of feature assets in such a way that
   gaurentees the publicAPI of ALL features are available prior to any
   other aspect expansion

**Accessing Feature Resources in a seamless way is a rudementary
benifit** of feature-u that aleviates a lot of problems in your code,
making your features truly plug-and-play.


#### injectContext()

When aspect definitions require feature resources at code expansion
time, you can wrap the aspect definition in a contextCallback
function.  In other words, your aspects can either be the raw aspect
itself (ex: a reducer), or a function that returns the aspect.

Your callback function should conform to the following signature:

```js
  contextCallback(feature, app): feature-aspect
```

When this is done, feature-u will invoke the contextCallback in a
controlled way, passing in the feature context as parameters (both
Feature and App objects).

To accomplish this, you must use the injectContext() function ... the
reason being that feature-u must be able to distinguish a
contextCallback function from other functions (ex: reducers).

Here is the same example (from above) that that fixes all of our
problems by replacing the imports with injectContext():

**`src/feature/featureA/logic.js`**
```js
                         // *1*
export const startApp = injectContext( (feature, app) => createLogic({

  name: `${feature.name}.myLogicModuleName`,     // *2*
  type: String(app.featureB.actions.fooBar),     // *3*
  
  process({getState, action}, dispatch, done) {
    dispatch( app.featureC.actions.fooBee() );   // *4*
    done();
  },
}));
```

 - `*1*`: `injectContext()` replaces the import of feature/app solving
   all our problems (keep reading).

 - `*2*`: we can now use `feature` as a single-source-of-truth to
   append our feature name to our logic module, BECAUSE it is now
   available (thanks to feature-u's `injectContext()`).

 - `*3*`: we can now monitor a different feature's action (using
   feature-u's publicAPI), because `app` is provided by
   `injectContext()`.

 - `*4*`: we no longer have to worry about the order of aspect
   expansion, because feature-u gaurentees the publicAPI of ALL
   features are available prior to any other aspect expansion.


#### Access Summary

In summary, you may access Feature Resources in one of 3 ways:

1. Use the app parameter supplied through feature-u's programmatic APIs
   (route, live-cycle hooks, and logic hooks)

2. Simply import the feature or app

3. Use the feature/app supplied through `injectContext()`

**NOTE**: It is possible that a module may be using more than one of
these techniques.  As an example a logic module may have to use
`injectContext()` to access app at expansion time, but is also
supplied app as a parameter in it's functional hook.  This is
perfectly fine, as they will be referencing the exact same app object
instance.




[react]:          https://reactjs.org/
[react-native]:   https://facebook.github.io/react-native/
[redux-logic]:    https://github.com/jeffbski/redux-logic
[eatery-nod]:     https://github.com/KevinAst/eatery-nod
[expo]:           https://expo.io/
[redux]:          http://redux.js.org/
[action-u]:       https://www.npmjs.com/package/action-u
[redux-actions]:  https://www.npmjs.com/package/redux-actions
