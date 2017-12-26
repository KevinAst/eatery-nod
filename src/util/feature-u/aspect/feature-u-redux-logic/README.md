# feature-u-redux-logic *(redux integration in feature-u)*

**feature-u-redux-logic** promotes the `logic` Aspect (a **feature-u**
plugin) that facilitates [redux-logic] integration to your features.

**feature-u** is a utility that facilitates feature-based project
organization for your [react] project. It helps organize your project by
individual features.  **feature-u** is extendable. It operates under an
open plugin architecture where Aspects provide the feature integration
to other framework/utilities that match your specific run-time stack.

**feature-u-redux-logic** is your **feature-u** integration point to
[redux-logic]!

?? TODO: DOC AI: insure feature-u links are valid ONCE feature-u docs have stabilized!

## At a Glance

- [Install](#install)
- [Usage](#usage)
- [A Closer Look](#a-closer-look)
  * [Why redux-logic?](#why-redux-logic)
- [Interface Points](#interface-points)
  * [Input](#input)
  * [Exposure](#exposure)
- [API](api.md)
  * [`logicAspect`](api.md#logicAspect)


## Install

```shell
npm install --save feature-u-redux-logic
```

**Please Note**: The following **peerDependencies** are in effect:
- **feature-u** (_??ver_)
- **[redux-logic]** (_??ver_)

## Usage

1. Register the **feature-u-redux-logic** `logicAspect` through
   **feature-u**'s `launchApp()` (_see: **NOTE 1** below_).

   **Please Note**: [redux] must also be present in your run-time
   stack, because [redux-logic] is a middleware component of [redux]
   (_see: **NOTE 2** below_).

   **myAppMain.js**
   ```js
   import {launchApp}      from 'feature-u';
   import {reducerAspect}  from 'feature-u-redux;        // *** NOTE 2 ***
   import {logicAspect}    from 'feature-u-redux-logic'; // *** NOTE 1 ***
   import features         from './feature';

   export default launchApp({

     aspects: [
       reducerAspect,  // *** NOTE 2 ***
       logicAspect,    // *** NOTE 1 ***
       ... other Aspects here
     ],

     features,

     registerRootAppElm(rootAppElm) {
       ReactDOM.render(rootAppElm,
                       getElementById('myAppRoot'));
     }
   });
   ```

   

2. Now you can specify a `logic` `createFeature()` named parameter
   (_in any of your features that maintain logic_) referencing the
   logic modules array (_see: **NOTE** below_).

   **myXyzFeature.js**
   ```js
   import {createFeature}  from 'feature-u';
   import logic            from './logic';
   
   export default createFeature({
     name:   'myXyzFeature',
     logic,  // *** NOTE *** myXyzFeature logic[]
     ... other props here
   });
   ```

In the nutshell, that's most everything you need to know to use
**feature-u-redux-logic**!  _Go forth and compute!_


## A Closer Look

Any feature that has business logic **promotes it's own logic modules
through the `logic` createFeature() parameter**.  While logic
modules are opaque functional assets, **feature-u's interest in them
is to merely register them to the [redux-logic] agent**.

Because logic modules may require feature-based context information,
**this parameter can also be a contextCB** - *a function that returns
the set of logic modules* (please refer to **feature-u**'s
[managedExpansion()](#managedexpansion) for more information).


It is important to note that even though your using
**feature-u-redux-logic**, your interface to [redux-logic] does not change in any
way.  In other words, your code continues to operate with [redux-logic] as it
always has.


### Why redux-logic?

There are many ways to introduce logic in your [react] app.  This
article breaks down the various options: **_[Where do I put my
business logic in a React-Redux
application?](https://medium.com/@jeffbski/where-do-i-put-my-business-logic-in-a-react-redux-application-9253ef91ce1)_**
The article is an introduction (and motivation) for the development of
**_[redux-logic]_** ... *redux middleware for organizing all your
business logic*.

I have been using
**[redux-logic](https://github.com/jeffbski/redux-logic)** since it's
inception and believe it is the **_best approach to encapsulate your
business logic_**. Prior to redux-logic, my business logic was spread
out in a variety of different places, including:

- component methods
- thunks
- and various middleware components

In addition, I relied heavily on batched actions, where logic entry
points would stimulate multiple actions in one procedural chunk of
code.  Needless to say, this was less than ideal. Even tools like
redux-dev-tools could not give me adequate insight into "what was
stimulating what"!

All of these techniques were replaced with "true" business logic,
organizing all my logic in one isolated spot, all orchestrated by
[redux-logic]!

My business logic is now:

- located in one logical discipline (i.e. dedicated "logic" modules)
- making it testable in isolation (very nice)!!
- has more concise and succinct goals
- promotes modular reuse
- provides traceable "cause and effects"
- is greatly simplified!


## Interface Points

**feature-u-redux-logic** accumulates all the logic modules from the
various features of your app, and registers them to [redux-logic].  This
is accomplished by creating the redux-logic middleware component which
is in turn registered to [redux].  The **Aspect Interface** to this
process (_i.e. the inputs and outputs_) are documented here.


### Input

- The input to **feature-u-redux-logic** are [redux-logic] modules.
  This is specified by each of your features (_that maintain logic_)
  through the `Feature.logic` property, containing a logic modules
  array.


### Exposure

- The output from **feature-u-redux-logic** is the [redux middleware]
  component, exposed through the `Aspect.getReduxMiddleware()` API
  (an "aspect cross-communication mechanism").  This middleware
  component must be consumed by yet another aspect (_such as
  **feature-u-redux**_) that in turn manages [redux].

## API

  * [`logicAspect`](api.md#logicAspect)



[react]:            https://reactjs.org/
[redux]:            http://redux.js.org/
[redux middleware]: https://redux.js.org/docs/advanced/Middleware.html
[redux-logic]:      https://www.npmjs.com/package/redux-logic
