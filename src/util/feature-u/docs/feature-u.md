# feature-u *(Feature Based Project Organization for React)*

**feature-u** is a utility library that _facilitates feature-based
project organization_ in your [react] project.  It assists in
organizing your project by individual features.  There are a number of
good articles that discuss this topic, but **feature-u** is a utility
library that manages and streamlines this process.

TODO: Badges HERE!

**_the Problem ..._**

_sooo ...  You have decided to structure your project code by
features_.  From a design perspective, there were a lot of
considerations in determining the feature boundaries.  In general, you
are feeling good about the progress.  It feels like the feature
segregation is going to make your code much more manageable.

However, there are some issues yet to be resolved ...

- How do you encapsulate and isolate your features, while still
  allowing them to collaborate with one another?

- How can selected features introduce start-up initialization, without
  relying on a global startup process (_even injecting utility at the
  root DOM_)?

- How do you promote feature-based UI components in an isolated and
  autonomous way?

- How do you configure your chosen frameworks now that your code is so
  spread out?

- How do you disable selected features which are either optional, or
  require a payed upgrade?

- How do you pull it all together so that your individual features
  operate as one application?

**_what now? (the Goal) ..._**

The **overriding goal** of **feature-u** is actually two fold:

1. Allow features to **Plug-and-Play!** This encompasses many things,
   such as: encapsulation, cross communication, enablement,
   initialization, etc., etc.  We will build on these concepts
   throughout this documentation.

2. **Automate the startup of your application!!** You have the
   features.  Allow them to promote their characteristics, so a
   central utility can **automatically configure the frameworks** used
   in your app, thereby **launching your application!**

   This task **must be accomplished in an extendable way**, _because
   not everyone uses the same set of frameworks!_


**_the Process ..._**

The basic process of feature-u is for each feature to promote a
`Feature` object that relays the various aspects within that feature.
In turn, these Feature objects are supplied to `launchApp()`, which
configures and starts your application, and returns the [App
Object](#app-object) (_which promotes the public API of each feature_).

<ul>

_It is important to understand that **feature-u** does not alter the
interface to your chosen frameworks in any way.  You use them the same
way you always have.  **feature-u** merely provides a well defined
organizational layer, where the frameworks are automatically
setup and configured by accumulating the necessary resources across all
your features._

</ul>


<!-- ?? sync/order this list consistently to: Why feature-u  -->

**_the Benefits ..._**

The benefits of using **feature-u** include:

- **Feature Encapsulation** _isolating feature implementations improves code manageability_

- **Cross Feature Communication** _a feature's public API is promoted through a well-defined standard_

- **Feature Enablement** _enable/disable features through a run-time switch_

- **App Life Cycle Hooks** _features can initialize themselves without
  relying on an external process_

- **Single Source of Truth** is facilitated in a number of ways
  _within a feature's implementation_

- **Framework Integration** _configure the framework(s) of your choice
  (matching your run-time-stack) using **feature-u**'s extendable API_

- **UI Component Promotion** _through Feature Routes_

- **Minimize Feature Order Dependency Issues** _even in code that is
  expanded in-line_

- **Plug-and-Play** _features can be added/removed easily_

- **Simplified Mainline** _launcApp() starts the app running by
  configuring the frameworks in use, all driven by a simple set of
  features!_

- **Operates in any React Flavor** _(React Web, React Native, Expo,
  etc.)_


<!-- ?? trash (I think):
- **Manages Feature Aspects** _accumulation, setup, configure, etc._
-->

**feature-u** allows you to **focus your attention on the "business
end" of your features!** _Go forth and compute!!_



## At a Glance

- [Usage](#usage)
  * [Directory Structure](#directory-structure)
  * [Feature Object](#feature-object)
  * [launchApp()](#launchapp)
  * [Real Example](#real-example)
- [Why feature-u](#why-feature-u)
- [A Closer Look](#a-closer-look)
- [aspects](#aspects)
- [Feature Object (relaying aspects)](#feature-object-relaying-aspects)
  * [Built-In aspects](#built-in-aspects)
  * [Extendable aspects](#extendable-aspects)
- [App Object](#app-object)
  * [Promoting Feature's Public API (via App)](#promoting-features-public-api-via-app)
  * [Checking Feature Dependencies (via App)](#checking-feature-dependencies-via-app))
- [Launching Your App](#launching-your-app)
  * [React Registration](#react-registration)
- [App Life Cycle Hooks](#app-life-cycle-hooks)
  * [appWillStart](#appwillstart)
  * [appDidStart](#appdidstart)
- [Feature Enablement](#feature-enablement)
- [Cross Feature Communication](#cross-feature-communication)
  * [publicFace and the App Object](#publicface-and-the-app-object)
  * [Accessing the App Object](#accessing-the-app-object)
    - [Managed Code Expansion](#managed-code-expansion)
    - [App Access Summary](#app-access-summary)
- [Single Source of Truth](#single-source-of-truth)
  * [Feature Name](#feature-name)
  * [Feature State Location](#feature-state-location)

- [Extending feature-u](#extending-feature-u)

- [API](api.md)
  * [`createFeature({name, [enabled], [publicFace], [appWillStart], [appDidStart], [pluggableAspects]}): Feature`](api.md#createFeature)
    - [`appWillStartCB({app, curRootAppElm}): rootAppElm || null`](api.md#appWillStartCB)
    - [`appDidStartCB({app, [appState], [dispatch]}): void`](api.md#appDidStartCB)
  * [`managedExpansion(managedExpansionCB): managedExpansionCB`](api.md#managedExpansion)
    - [`managedExpansionCB(app): AspectContent`](api.md#managedExpansionCB)
  * [`launchApp({[aspects], features, registerRootAppElm}): App`](api.md#launchApp)
    - [`registerRootAppElmCB(rootAppElm): void`](api.md#registerRootAppElmCB)
  * Extending feature-u
    - [`createAspect({see-docs}): Aspect`](api.md#createAspect)
      * [`validateConfigurationMeth(): string`](api.md#validateConfigurationMeth)
      * [`expandFeatureContentMeth(app, feature): string`](api.md#expandFeatureContentMeth)
      * [`validateFeatureContentMeth(feature): string`](api.md#validateFeatureContentMeth)
      * [`assembleFeatureContentMeth(app, activeFeatures): void`](api.md#assembleFeatureContentMeth)
      * [`assembleAspectResourcesMeth(app, aspects): void`](api.md#assembleAspectResourcesMeth)
      * [`injectRootAppElmMeth(app, activeFeatures, curRootAppElm): reactElm`](api.md#injectRootAppElmMeth)
      * [`addBuiltInFeatureKeyword(keyword): void`](api.md#addBuiltInFeatureKeyword)


<!-- ??

WORKING TOC: ********************************************************************************

- ? extending via Aspects
  * ? use other published npm packages
  * ? writing your extension: createAspect()

-->



<!-- *** SECTION ********************************************************************************  -->

## Usage

The basic usage pattern of feature-u is to:

1. Determine the Aspects that you will be using, based on your
   frameworks in use (i.e. your run-time stack).  This determines the
   extended aspects accepted by the Feature object (for example:
   `Feature.reducer` for [redux], and `Feature.logic` for [redux-logic]).

   Typically these Aspects are packaged seperatly in NPM, although you
   can create your own Aspects (if needed).

1. Organize your app into features.

   * Each feature should be located in it's own directory.

   * How you break your app up into features will take some time and
     throught.  There are many ways to approach this from a design
     perspective.

   * Each feature promotes it's aspects through a formal Feature
     object (using `createFeature()`).

1. Your mainline starts the app by invoking `launchApp()`, passing all
   Aspects and Features.  **Easy Peasy!!**


### Directory Structure

Here is a sample directory structure of an app that uses **feature-u**:

```
src/
  app.js              ... launches app using launchApp()

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
      reducer.js
      route.js

    featureB/         ... another app feature
      ...

  util/               ... common utilities used across all features
    ...
```

Each feature is located in it's own directory, containing it's aspects
(actions, reducers, components, routes, logic, etc.).

### Feature Object

Each feature promotes it's aspects through a Feature object (using
`createFeature()`).

**`src/feature/featureA/index.js`**
```js
import {createFeature}  from 'feature-u';
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

We will fill in more detail a bit later, but for now notice that
featureA defines reducers, logic modules, routes, and does some type
of initialization (appWillStart/appDidStart).  It also promotes a
publicFace (open/close) to other features.


### launchApp()

The **application mainline**, merely collects all aspects and
features, and starts the app by invoking `launchApp()`:

**`src/app.js`**
```js
import React             from 'react';
import ReactDOM          from 'react-dom';
import {routeAspect}     from './util/feature-u/aspect/feature-u-state-router';
import {reducerAspect}   from './util/feature-u/aspect/feature-u-redux';
import {logicAspect}     from './util/feature-u/aspect/feature-u-redux-logic';
import {launchApp}       from './util/feature-u';
import SplashScreen      from './util/comp/SplashScreen';
import features          from './feature'; // the set of features that comprise this application


// define our set of "plugable" feature-u Aspects, conforming to our app's run-time stack
const aspects = [
  routeAspect,   // StateRouter ... order: early, because <StateRouter> DOM injection does NOT support children
  reducerAspect, // redux       ... order: later, because <Provider> DOM injection should be on top
  logicAspect,   // redux-logic ... order: N/A,   because NO DOM injection
];


// configure our Aspects (as needed)
// ... StateRouter fallback screen (when no routes are in effect)
routeAspect.fallbackElm = <SplashScreen msg="I'm trying to think but it hurts!"/>;


// launch our app, exposing the feature-u App object (facilitating cross-feature communication)!
export default launchApp({
  aspects,
  features,
  registerRootAppElm(rootAppElm) {
    ReactDOM.render(rootAppElm,
                    getElementById('myAppRoot'));
  }
});
```

**NOTE:** The returned App object accumulates the publicFace of all
features (in named feature nodes), and is exported in order to support
cross-communication between features (_please refer to_ [Accessing the
App Object](#accessing-the-app-object)):

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

**Also NOTE:** In the example above you can see that `launchApp()`
uses a `registerRootAppElm()` callback hook to register the supplied
`rootAppElm` to the specific React framework in use.  Because this
registration is accomplished by app-specific code, **feature-u** can
operate in any of the React flavors, such as: React Web, React Native,
Expo, etc. (_please refer to:_ [React
Registration](#react-registration)).


Hopefully this gives you the basic idea of how **feature-u** operates.
The following sections develop a more thorough understanding! _Go
forth and compute!!_


### Real Example

Want to see a real **feature-u** app?
[eatery-nod](https://github.com/KevinAst/eatery-nod) is a React Native
Expo app that uses **feature-u**.  It was the project where
**feature-u** was conceived. TODO: describe just a bit more



<!-- *** SECTION ********************************************************************************  -->

## Why feature-u

There are many things to consider when segregating your project code
into seperate features.  How are a number of different things
acomplished?

This list represents the considerations that formed the basis of why
feature-u was developed!

1. **Encapsolation:**

   Most characteristics of a feature strive to be self-sufficient and
   independent.  Where possible, they operate within their own
   isolated implementation.

   **Solution:** Various **feature-u** traits

1. **Feature Collaboration:**

   Even though a feature's implementation is encapsolated, it still
   needs to interact with it's surroundings.  There is a need for
   collaboration between features.  This however should be acomplished
   through a well-defined feature-based public interface.

   **Solution:** [Cross Feature Communication](#cross-feature-communication)

1. **Initialization:**

   Any given feature should not have to rely on an external startup
   process to perform the initialization that it needs.  Rather, the
   feature should be able to spawn initialization that it depends on.

   This could be any number of things, such as:
    - initialize some service API
    - inject a utility react component at the root of the App
    - dispatch an action that kicks off some startup process
    - etc.

   **Solution:** [App Life Cycle Hooks](#app-life-cycle-hooks)

1. **Feature Enablement:**

   You may have the need for selected features to be dynamically
   enabled or disabled.  As an example, certain features may only be
   enabled for paid clients, or other features may only be used for
   diagnostic purposes.

   **Solution:** [Feature Enablement](#feature-enablement)

1. **Resource Resolution during Code Expansion:**

   There are situations where resource access can be problematic. This
   is typically a **timing issue**, _during in-line code expansion_,
   where the resource is not fully defined YET.  This **ultimately is
   due to order dependencies** across features.  

   **_How can this problem be minimized?_**
   
   **Solution:** [Managed Code Expansion](#managed-code-expansion)

1. **Framework Integration:**

   Most likely your application employs a number of different
   frameworks (ex: redux, redux-logic, etc.).  As a result, your
   features are typically going to rely on these same frameworks.

   How are the resources needed by these frameworks acumulated and
   configured across the many features of your app?

   **Solution:** [Extendable aspects](#extendable-aspects) -and- [Launching Your App](#launching-your-app)

1. **UI Component Promotion:**

   Features that maintain their own UI components need a way to promote
   them in the overall app's GUI.  How is this acomplished in an
   autonomous way?

   **Solution:** Feature Based Route Management (via the pluggable feature-u-state-router routeAspect) ??link-to-external-package

1. **Single Source of Truth:**

   What are some **Best Practices** for "Single Source of Truth" as it
   relates to features, and how can **feature-u** help?

   **Solution:** [Single Source of Truth](#single-source-of-truth)

1. **Simplified App Startup:**

   After breaking your application into pieces (i.e. features), how do
   you pull it all together, and actually start your app running?

   From an initial glance, this may seem like a daunting task.  As it
   turns out, however, because of the structure promoted by feature-u,
   it actually is a very simple process.

   **Solution:** [Launching Your App](#launching-your-app)




<!-- *** SECTION ********************************************************************************  -->

## A Closer Look

The basic process of feature-u is for each feature to promote a
`Feature` object that relays the various aspects within that feature.
In turn, these Feature objects are supplied to `launchApp()`, which
configures and starts your application, and returns the App object
which promotes the public API of each feature.

_Let's take a closer look at this process ..._


<!-- *** SECTION ********************************************************************************  -->
## aspects

In feature-u, "aspect" is a generalized term used to refer to the various
ingredients that (when combined) constitute your application.  Aspects
can take on many different forms ... for example:

  - UI Components and Routes, 
  - State Management (actions, reducers, selectors), 
  - Business Logic, 
  - Startup Initialization Code, 
  - etc.

**Not all aspects are of interest to feature-u** ...  _only those that
are needed to setup and launch the app_ ... all others are
considered to be an internal implementation detail of the feature.  As
an example, consider the redux state manager: while it uses actions,
reducers, and selectors ... only reducers are needed to setup and
configure redux.

**feature-u** provides a base set of **built-in aspects** (out-of-the-box)
but allows additional aspects to be introduced through it's extendable
API.

1. [**Built-In aspects**](#built-in-aspects):

   These aspects are promoted directly by the base feature-u package.
   They provide very rudimentary capabilities, such as feature
   enablement, public API, and application life-cycle hooks.

1. [**Extendable aspects**](#extendable-aspects):

   These aspects are promoted by external packages (_or self defined
   in your project_).  They provide feature-u integration with other
   frameworks (for example [redux] state management, or [redux-logic]
   business logic, or navigational routers, etc.).  They are created
   with feature-u's extendable API, and are packaged separately, so as
   to not introduce unwanted dependencies.



<!-- *** SECTION ********************************************************************************  -->
## Feature Object (relaying aspects)

The Feature object is merely a container that holds the aspects that
are of interest to feature-u.  

Each feature within your application promotes a Feature object (using
`createFeature()`) that catalogs the aspects of that feature.

Ultimatly, all Feature objects are consumed by `launchApp()`. 


### Built-In aspects

Built-in aspects are promoted directly by the base feature-u package.
They provide very rudimentary capabilities, such as feature
enablement, public API, and application life-cycle hooks.

Like all aspects, Built-In aspect content is relayed through Feature
object properties (via `createFeature()`).

- `Feature.name`
  
  ?? pull from JavaDoc ... discuss uniqueness and useages for single-source of truth ?? REFERENCE OTHER PARTS-OF-DOC

  
- `Feature.enabled`
  
  Each feature has an `Feature.enabled` boolean property that determines
  whether it is enabled or not.  This indicator is typically based on a
  dynamic expression.

  This allows packaged code to be dynamically enabled/disabled at
  run-time, and is useful in a number of different situations.  For
  example:

  - some features may only be enabled for paid clients

  - other features may only be used for diagnostic purposes, and are
    disabled by default

  If need be you can use the App object to determine if a feature is
  present or not (see: [Checking Feature Dependencies (via
  App)](#checking-feature-dependencies-via-app)).

  
- `Feature.publicFace`
  
  ?? pull from JavaDoc ... ?? REFERENCE OTHER PARTS-OF-DOC

  
- `Feature.appWillStart`
  
  ?? pull from JavaDoc ... ?? REFERENCE application life cycle

  
- `Feature.appDidStart`
  
  ?? pull from JavaDoc ... ?? REFERENCE application life cycle


### Extendable aspects

**feature-u** is extendable!  Extendable Aspects provide **feature-u**
integration with other frameworks (for example [redux] state
management, or [redux-logic] business logic, etc.).  For this reason
(_by in large_) **they provide the most value**, because they **fully
integrate your features into your run-time stack!**

They are packaged separately from **feature-u**, so as to not
introduce unwanted dependencies (_because not everyone uses the same
frameworks_).  You pick and choose them based on the framework(s) used
in your project (_matching your project's run-time stack_).

Extendable Aspects are created with **feature-u**'s extendable API, using
`createAspect()`.  You can define your own Aspect (_if the one you
need doesn't already exist_)!

Like all aspects, Extendable Aspect content is relayed through Feature
object properties (via `createFeature()`).

Because Extendable Aspects are not part of the base **feature-u**
package, it is a bit problematic to discuss them here (_they are
either in a seperate npm package, or self contained in your project_).
**You should search the npm registry with the `'feature-u'` keyword**
_to find the ones that meet your requirements_.  With that said, we
will discuss a few of the Extendable Aspects that were created in
conjunction with the initial development of **feature-u** (_just to give
you a feel of what is possible_).


- `Feature.reducer` via: **feature-u-redux**
  
  **feature-u-redux** is the **feature-u** integration point to
  [redux]!

  It configures [redux] through the `reducerAspect` (_to be
  supplied to_ `launchApp()`), which extends the Feature object,
  adding support for the `Feature.reducer` property, referencing
  feature-based reducers.

  Only reducers are of interest because that is all that is needed to
  configure [redux].  All other redux items (_actions, selectors,
  etc._) are considered to be an internal implementation detail of the
  feature.

  The `Feature.reducer` content must be embellished by
  `slicedReducer()`, which provides instructions on how to combine
  multiple feature-based reducers in constructing the overall
  top-level application state tree.

  Because **feature-u-redux** manages redux, it also provides an
  integration hook to other Aspects that need to inject redux
  middleware.

  Please refer to the **feature-u-redux** documentation for complete
  details.
  
  
- `Feature.logic` via: **feature-u-redux-logic**

  **feature-u-redux-logic** is the **feature-u** integration point to
  [redux-logic]!

  It configures [redux-logic] through the `logicAspect` (_to be
  supplied to_ `launchApp()`), which extends the Feature object,
  adding support for the `Feature.logic` property, referencing
  feature-based logic modules.

  The following article is an introduction (and motivation) for the
  development of redux-logic: [Where do I put my business logic in a
  React-Redux
  application](https://medium.com/@jeffbski/where-do-i-put-my-business-logic-in-a-react-redux-application-9253ef91ce1).

  Please refer to the **feature-u-redux-logic** documentation for complete
  details.

 
- `Feature.route` via: **feature-u-state-router**

  **feature-u-state-router** is the **feature-u** integration point to
  **Feature Routes**!

  It configures **Feature Router** through the `routeAspect` (_to be
  supplied to_ `launchApp()`), which extends the Feature object,
  adding support for the `Feature.route` property, referencing routes
  defined through the `featureRoute()` function.

  **Feature Routes** are _based on a very simple concept_: **allow the
  application state to drive the routes!** It operates through a
  series of registered functional callback hooks, which determine the
  active screen based on an analysis of the the overall appState.
  This is particulary useful in feature-based routing, because each
  feature can promote their own UI components in an encapsulated and
  autonomous way!  Because of this, **feature-u-state-router** is a
  preferred routing solution for **feature-u**.

  Please refer to the **feature-u-state-router** documentation for complete
  details.



<!-- *** SECTION ********************************************************************************  -->
## App Object

The App object is emitted from `launchApp()` function, and promotes
information about the Features within the app:

- both the [feature's public API](#promoting-features-public-api-via-app)
- and [whether a feature exists or not](#checking-feature-dependencies-via-app)

### Promoting Feature's Public API (via App)

The App object promotes the feature's Public API (i.e. it's
publicFace).

The project's mainline function should export the app object (i.e. the
return of `launchApp()`), so other modules can access it.  Please note
that depending on the context, there are various techniques by which
the App object can be accessed (see: [Accessing the App
Object](#accessing-the-app-object)).

The App object is structured as follows:

```js
App.{featureName}.{publicFace}
```

As an example, an application that has two features (featureA, and
featureB) will look like this:

```js
app: {
  featureA: {
    action: {
      open(),
      close()
    }
  },
  featureB: {
  }
}
```

You can see that featureA is promoting a couple of actions (open(),
close()) in it's publicFace, while featureB has NO publicFace.


### Checking Feature Dependencies (via App)

The App object can be used to determine if a feature is present or
not.  If a feature does not exist, or has been disabled, the
corresponding `app.{featureName}` will NOT exist.

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
   appWillStart({app, curRootAppElm}) {
     assert(app.featureD, '***ERROR*** I NEED featureD');
   }
   ```


<!-- *** SECTION ********************************************************************************  -->
## Launching Your App

By assimilating the set of features that comprise an application,
interpreting each feature aspect, **feature-u** can actually
coordinate the launch of your application (i.e. start it running)!

This is accomplished through the `launchApp()` function.

- It manages the setup and configuration of the frameworks in use,
  such as [redux], [redux-logic], etc.  This is based on a set of
  supplied plugable Aspects that extend **feature-u**, integrating
  external frameworks to match your specific run-time stack.

- It facilitates application life-cycle methods on the Feature object,
  allowing features to manage things like: initialization and
  injecting root UI elements, etc.

- It creates and promotes the App object which contains the publicFace
  of all features, facilitating a cross-communication between features.

In essence, your application mainline becomes a single line of
executable code!!

**`src/app.js`**
```js
import React             from 'react';
import ReactDOM          from 'react-dom';
import {routeAspect}     from './util/feature-u/aspect/feature-u-state-router';
import {reducerAspect}   from './util/feature-u/aspect/feature-u-redux';
import {logicAspect}     from './util/feature-u/aspect/feature-u-redux-logic';
import {launchApp}       from './util/feature-u';
import SplashScreen      from './util/comp/SplashScreen';
import features          from './feature'; // the set of features that comprise this application


// define our set of "plugable" feature-u Aspects, conforming to our app's run-time stack
const aspects = [
  routeAspect,   // StateRouter ... order: early, because <StateRouter> DOM injection does NOT support children
  reducerAspect, // redux       ... order: later, because <Provider> DOM injection should be on top
  logicAspect,   // redux-logic ... order: N/A,   because NO DOM injection
];


// configure our Aspects (as needed)
// ... StateRouter fallback screen (when no routes are in effect)
routeAspect.fallbackElm = <SplashScreen msg="I'm trying to think but it hurts!"/>;


// launch our app, exposing the feature-u App object (facilitating cross-feature communication)!
export default launchApp({
  aspects,
  features,
  registerRootAppElm(rootAppElm) {
    ReactDOM.render(rootAppElm,
                    getElementById('myAppRoot'));
  }
});
```

The returned App object accumulates the publicFace of all features (in
named feature nodes), and is exported in order to support
cross-communication between features (_please refer to_ [Accessing the
App Object](#accessing-the-app-object)):


### React Registration

In the example above you can see that `launchApp()` uses a
`registerRootAppElm()` callback hook to register the supplied
`rootAppElm` to the specific React framework in use.  Because this
registration is accomplished by app-specific code, **feature-u** can
operate in any of the React flavors, such as: React Web, React Native,
Expo, etc.

**React Web**
```js
import ReactDOM from 'react-dom';
...
export default launchApp({
  aspects,
  features,
  registerRootAppElm(rootAppElm) {
    ReactDOM.render(rootAppElm,
                    getElementById('myAppRoot'));
  }
});
```

**React Native**
```js
import {AppRegistry} from 'react-native';
...
export default launchApp({
  aspects,
  features,
  registerRootAppElm(rootAppElm) {
    AppRegistry.registerComponent('myAppKey',
                                  ()=>rootAppElm); // convert rootAppElm to a React Component
  }
});
```

**Expo**
```js
import Expo from 'expo';
...
export default launchApp({
  aspects,
  features,
  registerRootAppElm(rootAppElm) {
    Expo.registerRootComponent(()=>rootAppElm); // convert rootAppElm to a React Component
  }
});
```




<!-- *** SECTION ********************************************************************************  -->
## App Life Cycle Hooks

Because feature-u is in control of launching the app, application life
cycle hooks can be introduced, allowing features to perform
app-specific initialization, and even inject components into the
root of the app.

Two hooks are provided through the following feature properties:

1. [**appWillStart**](#appwillstart) - invoked one time at app startup time
2. [**appDidStart**](#appdidstart)   - invoked one time immediatly after app has started



### appWillStart

The **appWillStart** life-cycle hook is invoked one time, just before
the app starts up.

```js
API: appWillStart({app, curRootAppElm}): rootAppElm || null
```

This life-cycle hook can do any type of initialization.  For
example: initialize FireBase.

In addition, this life-cycle hook can optionally supplement the app's
top-level root element (i.e. react component instance).  Any
significant return (truthy) is interpreted as the app's new
rootAppElm.  **IMPORTANT**: When this is used, the supplied
curRootAppElm MUST be included as part of this definition
(accommodating the accumulative process of other feature injections)!

Here is an example that injects new root-level content:
```js
appWillStart({app, curRootAppElm}) {
  ... any other initialization ...
  return (
    <Drawer ...>
      {curRootAppElm}
    </Drawer>
  );
}
```

Here is an example of injecting a new sibling to curRootAppElm:
```js
appWillStart: ({app, curRootAppElm}) => [React.Children.toArray(curRootAppElm), <Notify key="Notify"/>]
```


### appDidStart

The **appDidStart** life-cycle hook is invoked one time immediatly
after app has started.

```js
API: appDidStart({app, appState, dispatch}): void
```

Because the app is up-and-running at this time, you have access to the
appState and dispatch() function ... assuming you are using redux
(when detected by feature-u's plugable aspects).

A typical usage for this hook is to dispatch some type of bootstrap
action.  Here is a startup feature, that issues a bootstrap action:

```js
appDidStart({app, appState, dispatch}) {
  dispatch( actions.bootstrap() );
}
```


<!-- *** SECTION ********************************************************************************  -->
## Feature Enablement

Each feature has an `Feature.enabled` boolean property that determines
whether it is enabled or not.  This indicator is typically based on a
dynamic expression.

This allows packaged code to be dynamically enabled/disabled at
run-time, and is useful in a number of different situations.  For
example:

- some features may only be enabled for paid clients

- other features may only be used for diagnostic purposes, and are
  disabled by default

If need be you can use the App object to determine if a feature is
present or not (see: [Checking Feature Dependencies (via
App)](#checking-feature-dependencies-via-app)).


<!-- *** SECTION ********************************************************************************  -->
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
  * [publicFace and the App Object](#publicface-and-the-app-object)
  * [Accessing the App Object](#accessing-the-app-object)
    - [Managed Code Expansion](#managed-code-expansion)
    - [App Access Summary](#app-access-summary)


### publicFace and the App Object

In feature-u, this cross-feature-communication is accomplished through
the `Feature.publicFace` built-in aspect property.

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

The `publicFace` of all features are accumulated and exposed through
the [App Object](#app-object) (emitted from `launchApp()`), as
follows:

```js
App.{featureName}.{publicFace}
```

As an example, the sample above can be referenced like this: 

```js
  app.featureA.sel.isDeviceReady(appState)
```

### Accessing the App Object

The App object can be accessed in several different ways.

1. The simplest way to access the App object is to merely import it.

   Your application mainline exports the `launchApp()` return value
   ... which is the App object.

   **`src/app.js`**
   ```js
   ...

   // launch our app, exposing the feature-u App object (facilitating cross-feature communication)!
   export default launchApp({
     ...
   });
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

   * app life-cycle hooks:
     ```js
     appWillStart({app, curRootAppElm}): rootAppElm || null
     appDidStart({app, appState, dispatch}): void                        
     ```
   
   * route hooks (PKG: `feature-u-state-router`):
     ```js
     routeCB({app, appState}): rendered-component (null for none)
     ```
   
   * logic hooks (PKG: `feature-u-redux-logic`):
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
   through [Managed Code Expansion](#managed-code-expansion) (_see
   next section_).


### Managed Code Expansion

In the previous discussion, we detailed two ways to access the App
object, and referred to a third technique (_discussed here_).

There are two situations that make accessing the `app` object
problematic, which are: **a:** _in-line code expansion (where the app
may not be fully defined)_, and **b:** _order dependencies (across
features)_.

To illustrate this, the following logic module (PKG:
`feature-u-redux-logic`) is monitoring an action defined by an
external feature (see `*1*`).  Because this `app` reference is made
during code expansion time, the import will not work, because the
`app` object has not yet been fully defined.  This is a timing issue.

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

When aspect content definitions require the `app` object at code
expansion time, you can wrap the definition in a `managedExpansion()`
function.  In other words, your aspect content can either be the
actual content itself (ex: a reducer), or a function that returns the
content.

Your callback function should conform to the following signature:

```js
API: managedExpansionCB(app): AspectContent
```

When this is done, feature-u will invoke the managedExpansionCB in a
controlled way, passing the fully resolved `app` object as a
parameter.

To accomplish this, you must wrap your expansion function with the the
`managedExpansion()` utility.  The reason for this is that feature-u
must be able to distinguish a managedExpansionCB function from other
functions (ex: reducers).

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

Because managedExpansionCB is invoked in a controlled way (by
feature-u), the supplied `app` parameter is guaranteed to be defined
(_issue **a**_).  Not only that, but the supplied `app` object is
guaranteed to have all features publicFace definitions resolved
(_issue **b**_).

**_SideBar_**: A secondary reason `managedExpansion()` may be used
(_over and above app injection during code expansion_) is to **delay
code expansion**, which can avoid issues related to (_legitimate but
somewhat obscure_) circular dependencies.


### App Access Summary

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



<!-- *** SECTION ********************************************************************************  -->
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




<!-- *** SECTION ********************************************************************************  -->

## Extending feature-u

**feature-u** is extendable!  It operates under an open pluggable
architecture where Extendable Aspects integrate **feature-u** to other
frameworks, matching your specific run-time stack.  This is good,
because not everyone uses the same frameworks!

 - You want state management using [redux]?  There is an Aspect for
   that: [feature-u-redux].

 - You want to maintain your logic using [redux-logic]?  There is an
   Aspect for that: [feature-u-redux-logic].

 - You want your features to autonomously promote their screens
   within the application?  There is an Aspect for that: [Feature
   Routes].

 - Can't find an Aspect that integrates the XYZ framework?  You can
   create one through the `createAspect()` function!  

   For extra credit, you can publish this so other XYZ users can
   benefit from your work!  If you decide to do this, please include the
   'feature-u' keyword so others can easily find your package.

It is important to understand that **feature-u** does not alter the
interface to these frameworks in any way.  You use them the same way
you always have.  feature-u merely provides a well defined
organizational layer, where the frameworks are automatically
setup and configured by accumulating the necessary resources across all
your features.

?? introduce Aspect object and it's accumulation process

?? detail createAspect() and each Aspect method



<!-- *** SECTION ********************************************************************************  -->

## API

  * [`createFeature({name, [enabled], [publicFace], [appWillStart], [appDidStart], [pluggableAspects]}): Feature`](api.md#createFeature)
    - [`appWillStartCB({app, curRootAppElm}): rootAppElm || null`](api.md#appWillStartCB)
    - [`appDidStartCB({app, [appState], [dispatch]}): void`](api.md#appDidStartCB)
  * [`managedExpansion(managedExpansionCB): managedExpansionCB`](api.md#managedExpansion)
    - [`managedExpansionCB(app): AspectContent`](api.md#managedExpansionCB)
  * [`launchApp({[aspects], features, registerRootAppElm}): App`](api.md#launchApp)
    - [`registerRootAppElmCB(rootAppElm): void`](api.md#registerRootAppElmCB)
  * Extending feature-u
    - [`createAspect({see-docs}): Aspect`](api.md#createAspect)
      * [`validateConfigurationMeth(): string`](api.md#validateConfigurationMeth)
      * [`expandFeatureContentMeth(app, feature): string`](api.md#expandFeatureContentMeth)
      * [`validateFeatureContentMeth(feature): string`](api.md#validateFeatureContentMeth)
      * [`assembleFeatureContentMeth(app, activeFeatures): void`](api.md#assembleFeatureContentMeth)
      * [`assembleAspectResourcesMeth(app, aspects): void`](api.md#assembleAspectResourcesMeth)
      * [`injectRootAppElmMeth(app, activeFeatures, curRootAppElm): reactElm`](api.md#injectRootAppElmMeth)
      * [`addBuiltInFeatureKeyword(keyword): void`](api.md#addBuiltInFeatureKeyword)




[react]:          https://reactjs.org/
[react-native]:   https://facebook.github.io/react-native/
[redux-logic]:    https://github.com/jeffbski/redux-logic
[eatery-nod]:     https://github.com/KevinAst/eatery-nod
[expo]:           https://expo.io/
[redux]:          http://redux.js.org/
[action-u]:       https://www.npmjs.com/package/action-u
[redux-actions]:  https://www.npmjs.com/package/redux-actions
