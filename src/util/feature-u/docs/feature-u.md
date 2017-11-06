# feature-u *(Feature Based Project Organization for React)*

feature-u is a library that facilitates feature-based project
organization for react projects.  It assists in organizing your
project by individual features.  There are many good articles that
discuss this topic, but I wanted an actual utility that streamlines
and manages the process.

In the nut-shell, feature-u catalogs all app features, each with their
own set of isolated aspects (actions, reducers, logic, components,
routes, etc.), and manages these features by actually launching the
app (once the aspects of all feature have been configured and
registered to the appropriate concern).  In general, it encapsulated
each feature to it's own isolated implementation.  With that said, it
provides a mechanism by which features can inner-communicate with one
another (through a public API).  A feature can be enabled/disabled
through a simple flag.  App-level life cycle hooks are supported,
allowing a feature to inject app-specific initialization, and even
introduce components into the root of the app.  This truly makes the
individual features of an app plug-and-play.

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
- [API](#api)
  * [IFormMeta](#iformmeta)
    - registrar
      * [formActionGenesis](#iformmetaregistrarformactiongenesis)
      * [formLogic](#iformmetaregistrarformlogic)
      * [formReducer](#iformmetaregistrarformreducer)
    - [formStateSelector](#iformmetaformstateselector)
    - [IForm](#iformmetaiform)


## Intro

TODO: ?? walk through a simple example of feature-a, and feature-b, and runApp()



## A Closer Look

TODO: ??


### Feature Aspects

TODO: ??


#### Actions

TODO: ??



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





### Aspect Definition

TODO: ?? discuss: Resource Access: Feature aspects need to access various resources within their implementation

feature-u supports this in a way that minimizes (or eliminates) issues
related to feature dependancy order - EVEN external references found
in code that is expanded in-line.







[redux-logic]: https://github.com/jeffbski/redux-logic
[eatery-nod]: https://github.com/KevinAst/eatery-nod
[react-native]: https://facebook.github.io/react-native/
[expo]: https://expo.io/
[redux]: http://redux.js.org/
