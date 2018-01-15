# feature-u *(Feature Based Project Organization for React)*

**feature-u** is a utility library that _facilitates feature-based
project organization_ in your [react] project.  It assists in
organizing your project by individual features.  There are a number of
good articles that discuss this topic, but **feature-u** is a utility
library that manages and streamlines this process.

TODO: Badges HERE!

**_the Problem ..._**

_sooo ... You have decided to structure your project code in
segregated feature directories._ **Now what?**

- How do you encapsulate your features, while still allowing them to
  collaborate with one another?

- How do you configure your chosen frameworks now that your code 
  is so spread out?

- How do you pull it all together so that your individual features
  operate as one application?


**_the Goal ..._**

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
configures and starts your application, and returns the App object
which promotes the public API of each feature.

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

- **Feature Enablement** _enable/disable through a run-time switch_

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
  * [aspects](#aspects)
  * [Feature Object (relaying aspects)](#feature-object-relaying-aspects)
    - [built-in aspects](#built-in-aspects)
    - [extendable aspects](#extendable-aspects)
  * [App Object](#app-object)
    - [Promoting Feature's Public API (via App)](#promoting-features-public-api-via-app)
    - [Checking Feature Dependencies (via App)](#checking-feature-dependencies-via-app))

- [Extending feature-u](#extending-feature-u)



<!-- ??? 

WORKING TOC: ********************************************************************************

- Usage
- Why feature-u
- Feature Aspects
- App Object

- ? Launching Your App ... ?? discusses launchApp() in more detail

- ? Feature Based Route Management ?? briefly discuss in the abstract, point to other packages (not part of the base package)

?? base capabilities
- ? managedExpansion() ... minor thing in accessing the App object during in-line code expansion ... basically delaying the expansion under a controlled env

- ? extending via Aspects
  * ? use other published npm packages
  * ? writing your extension: createAspect()

- ? App Life Cycle Hooks
  * appWillStart
  * appDidStart

- ? Cross Feature Communication
  * publicFace
  * App Object
    - Accessing the App Object
      * managedExpansion()
      * App Access Summary
    - Checking Feature Dependencies (via App)

- ? Single Source of Truth
  * Feature Name
  * Feature State Location

- ? API


?? pull up for real ...

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


-->



<!-- *** SECTION ********************************************************************************  -->

## Usage

The basic usage pattern of feature-u is to:

 - Determine the external frameworks your app will be using.  This
   defines your application run-time stack, and dictates the set of
   feature-u Aspects that will be used.  Aspects are feature-u
   extensions points, and extend the available properties found on the
   Feature object.

 - Organize your app into features.

   * Each feature is found in it's own seperate directory.

   * How you break your app up into features will take some time and
     throught.  There are many ways to approach this from a design
     perspective.

   * Each feature catalogs and promotes the various aspects of
     itself through a formal Feature object (using createFeature()).

 - All Aspect and Feature objects are accumulated and supplied to the
   launchApp() function that starts your app running.

### Directory Structure

Here is a typical directory structure of an app that uses feature-u:

??? SAMPLE DIR

Each feature is located in it's own directory, and promotes it's
characteristics through a Feature object (using createFeature()).

### Feature Object

?? show createFeature()

You can see that featureA defines ?? bla bla bla ?? we will fill in
more detail later, but for now, just notice that ?? bla bla bla

### launchApp()

?? bla bla bla


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

1. Encapsolation:

   Most characteristics of a feature strive to be self-sufficient and
   independent.  Where possible, they operate within their own
   isolated implementation.

   Solution: Various **feature-u** traits

1. Feature Collaboration:

   Even though a feature's implementation is encapsolated, it still
   needs to interact with it's surroundings.  There is a need for
   collaboration between features.  This however should be acomplished
   through a well-defined feature-based public interface.

   Solution: Cross Feature Communication ??link

1. Initialization:

   Any given feature should not have to rely on an external startup
   process to perform the initialization that it needs.  Rather, the
   feature should be able to spawn initialization that it depends on.

   This could be any number of things, such as:
    - initialize some service API
    - inject a utility react component at the root of the App
    - dispatch an action that kicks off some startup process
    - etc.

   Solution: App Life Cycle Hooks ??link

1. Feature Enablement:

   You may have the need for selected features to be dynamically
   enabled or disabled.  As an example, certain features may only be
   enabled for paid clients, or other features may only be used for
   diagnostic purposes.

   Solution: Feature Enablement ??link/this-is-new

1. ?? in-line code expansion and dependency order issues ... managedExpansion()

1. Framework Integration:

   Most likely your application employs a number of different
   frameworks (ex: redux, redux-logic, etc.).  As a result, your
   features are typically going to rely on these same frameworks.

   How are the resources needed by these frameworks acumulated and
   configured across the many features of your app?

   Solution: Pluggable Aspects ??link -and- launchApp() ??link

1. UI Component Promotion:

   Features that maintain their own UI components need a way to promote
   them in the overall app's GUI.  How is this acomplished in an
   autonomous way?

   Solution: Feature Based Route Management (via the pluggable feature-u-state-router routeAspect) ??link

1. ?? facilitate single-source-of-truth within a feature's implementation

1. Simplified App Startup

   After breaking your application into pieces (i.e. features), how do
   you pull it all together, and actually start your app running?

   From an initial glance, this may seem like a daunting task.  As it
   turns out, however, because of the structure promoted by feature-u,
   it actually is a very simple process.

   Solution: launchApp() ... Launching Your App ??link




<!-- *** SECTION ********************************************************************************  -->

## A Closer Look

The basic process of feature-u is for each feature to promote a
`Feature` object that relays the various aspects within that feature.
In turn, these Feature objects are supplied to `launchApp()`, which
configures and starts your application, and returns the App object
which promotes the public API of each feature.

_Let's take a closer look at this process ..._


<!-- *** SUB-SECTION ********************************************************************************  -->
### aspects

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



<!-- *** SUB-SECTION ********************************************************************************  -->
### Feature Object (relaying aspects)

The Feature object is merely a container that holds the aspects that
are of interest to feature-u.  

Each feature within your application promotes a Feature object (using
`createFeature()`) that catalogs the aspects of that feature.

Ultimatly, all Feature objects are consumed by `launchApp()`. 


#### Built-In aspects

Built-in aspects are promoted directly by the base feature-u package.
They provide very rudimentary capabilities, such as feature
enablement, public API, and application life-cycle hooks.

Like all aspects, Built-In aspect content is relayed through Feature
object properties (via `createFeature()`).

- `Feature.name`
  
  ?? pull from JavaDoc ... discuss uniqueness and useages for single-source of truth ?? REFERENCE OTHER PARTS-OF-DOC

  
- `Feature.enabled`
  
  ?? pull from JavaDoc ... discuss dynamic enablement, AND verifying existance ?? REFERENCE OTHER PARTS-OF-DOC

  
- `Feature.publicFace`
  
  ?? pull from JavaDoc ... ?? REFERENCE OTHER PARTS-OF-DOC

  
- `Feature.appWillStart`
  
  ?? pull from JavaDoc ... ?? REFERENCE application life cycle

  
- `Feature.appDidStart`
  
  ?? pull from JavaDoc ... ?? REFERENCE application life cycle


#### Extendable aspects

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
  
  ?? summarize docs from external package AND reference that doc
  ?? also mention UI Components


<!-- *** SUB-SECTION ********************************************************************************  -->
### App Object

The App object is emitted from `launchApp()` function, and promotes
information about the Features within the app:

- both the [feature's public API](#promoting-features-public-api-via-app)
- and [whether a feature exists or not](#checking-feature-dependencies-via-app)

#### Promoting Feature's Public API (via App)

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


#### Checking Feature Dependencies (via App)

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

<!-- ??? feature-u UserDoc ... CURRENT POINT ... migrate to feature-u.md ********************************************************************************  -->





[react]:          https://reactjs.org/
[react-native]:   https://facebook.github.io/react-native/
[redux-logic]:    https://github.com/jeffbski/redux-logic
[eatery-nod]:     https://github.com/KevinAst/eatery-nod
[expo]:           https://expo.io/
[redux]:          http://redux.js.org/
[action-u]:       https://www.npmjs.com/package/action-u
[redux-actions]:  https://www.npmjs.com/package/redux-actions
