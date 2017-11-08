# feature-u *(Feature Based Project Organization for React)*

feature-u is a library that facilitates feature-based project
organization for your [react] project.  It assists in organizing your
project by individual features.  There are many good articles that
discuss this topic, but I wanted a utility that streamlines and
manages the process.

Essentially, feature-u accumulates all features (and their aspects)
that comprise an app (ex: actions, reducers, components, routes,
logic, etc.), managing and registering these items to the appropriate
concerns (ex: redux, redux-logic, router, etc.), and then launches the
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
      router.js

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
import router           from './router';
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
  router,

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

TODO: ?? consider eliminating "A Closer Look"


### Feature Aspects

In feature-u, "aspect" is a general term used to refer to the various
ingredients that, when combined, constitute your app.  For example,
"aspects" can refer to actions, reducers, components, routes, logic,
etc.

Let's take a closer look at the various aspects that make up a
feature, and discover how feature-u manages these items.


#### Actions

Within the [redux] framework,
[actions](https://redux.js.org/docs/basics/Actions.html) are the basic
building blocks that facilitate application activity.  Actions follow
a pre-defined convention that promote an action type and a
type-specific payload.

In general, **actions are considered to be an internal detail of the
feature**, and therefore are **NOT managed by feature-u**.  In other
words, *each feature will define and use it's own set of actions*.

This allows you to manage your actions however you wish.  Best
practices prescribe that actions should be created by [action
creators](https://redux.js.org/docs/basics/Actions.html#action-creators)
(functions that return actions).  It is common to manage your action
creators and action types through a library like
[action-u](https://www.npmjs.com/package/action-u) or
[redux-actions](https://www.npmjs.com/package/redux-actions).

With that said, **there are cases where actions need to be promoted
outside of a feature's implementation**.  Say, for example, featureA's
reducer needs to monitor one of featureB's actions, or one of
featureB's logic modules needs to dispatch a featureA action.  When
this happens **the [Public API](#public-api) feature-u aspect can be
used for this promotion**.  Please note that in consideration of
feature encapsulation, *best practices would strive to minimize the
public promotion of actions outside the feature boundry*.


#### Reducers (state)

TODO: ??



#### Selectors (encapsolating state)

TODO: ??



#### Logic

TODO: ??



#### Components

TODO: ??



#### Routes

TODO: ??



#### Public API

TODO: ??



#### App Life Cycle Hooks

TODO: ??




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

- Within feature-u's programatic APIs, the App object is supplied as a
  parameter.

  * router:
    ```js
    functionCB(app, appState): rendered-component (null for none)
    ```
  * app life-cycle functions:
    ```js
    appWillStart(app, children): optional-top-level-content
    appDidStart({app, appState, dispatch}): void                        
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

With that said, there are **two issues that make access to these
resources problematic** (*which are addressed by feature-u*):

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
   ... please refer to [injectContext()](#injectcontext) (below).

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






[react]:          https://reactjs.org/
[react-native]:   https://facebook.github.io/react-native/
[redux-logic]:    https://github.com/jeffbski/redux-logic
[eatery-nod]:     https://github.com/KevinAst/eatery-nod
[expo]:           https://expo.io/
[redux]:          http://redux.js.org/
