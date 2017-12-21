# feature-u-redux *(redux integration to feature-u)*

feature-u-redux promotes a `reducer` Aspect (a feature-u plugin) that
facilitates redux integration to your features.

feature-u is a utility that facilitates feature-based project
organization for your react project. It helps organize your project by
individual features.  feature-u is extendable. It operates under an
open plugin architecture where Aspects provide the feature integration
to other framework/utilities that match your specific run-time stack.

feature-u-redux is your feature-u integration point to redux!

?? TODO: DOC AI: insure feature-u links are valid ONCE feature-u docs have stabilized!

## At a Glance

- [Install](#install)
- [Usage](#usage)
- [A Closer Look](#a-closer-look)
  * [Actions](#actions)
  * [Reducers (state)](#reducers-state)
    - [Sliced Reducers](#sliced-reducers)
  * [Selectors (encapsulating state)](#selectors-encapsulating-state)
    - [Single Source of Truth (Feature State Location)](#single-source-of-truth-feature-state-location)
- [Interface Points](#interface-points)
  * [Inputs](#inputs)
  * [Exposure](#exposure)
- [API](api.md)
  * [`reducerAspect`](api.md#reducerAspect)
  * [`slicedReducer()`](api.md#slicedReducer)


## Install

```shell
npm install --save feature-u-redux
```

**Please Note**: the following **peerDependencies** are in effect:
- feature-u (_??ver_)
- redux (_??ver_)
- other ??

## Usage

1. Register the **feature-u-redux** `reducerAspect` through
   **feature-u**'s `launchApp()` (_see: **NOTE** below_):

   **myAppMain.js**
   ```js
   import {launchApp}      from 'feature-u';
   import {reducerAspect}  from 'feature-u-redux'; // *** NOTE ***
   import features         from './feature';

   export default launchApp({

     aspects: [
       reducerAspect,    // *** NOTE ***
       ... other Aspects here
     ],

     features,

     registerRootAppElm(rootAppElm) {
       ReactDOM.render(rootAppElm,
                       getElementById('myAppRoot'));
     }
   });
   ```

2. Now you can specify the `reducer` Feature property in any of your
   features that maintain state (_see: **NOTE** below_):

   **myXyzFeature.js**
   ```js
   import {createFeature}  from 'feature-u';
   import {slicedReducer}  from 'feature-u-redux';
   import myXyzFeatureReducer from './state';
   
   export default createFeature({
     name:     'myXyzFeature',
     reducer:  slicedReducer('my.feature.state.location', myXyzFeatureReducer), // *** NOTE ***
     ... other props here
   });
   ```

   Because **feature-u-redux** combines the state of all your features
   into one overall appState, you must specify where each feature
   state lives (through the `slicedReducer()` function).

In the nutshell, that's most everything you need to know to use
**feature-u-redux**!  _Go forth and compute!_


## A Closer Look

In working with the [redux] framework, you deal with [actions],
[reducers], and [selectors].

**feature-u-redux** is only concerned with the characteristics of
redux that are required to configure it (_a generalized principle of
all feature-u Aspects_).  As a result, **feature-u-redux** is only
interested in your reducers, because that is what it needs to
configure redux.  All other redux items are considered internal
details of your feature code.

It is important to note that even though your using
**feature-u-redux**, your interface to redux does not change in any
way.  In other words, your code continues to operate with redux as it
always has.

With that said, there are some feature-based best practices that you
should strive to achieve.  As an example, you should strive to keep
each feature isolated, so it is truly plug-and-play.

Let's take a closer look at some basic redux concepts, highlighting
several feature-based items of interest.


### Actions

Within the [redux] framework, [actions] are the basic building blocks
that facilitate application activity.

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
featureB's logic module needs to dispatch a featureA action.  When
this happens **the [publicFace](#publicface) feature-u aspect can be
used for this promotion**.  Please note that in consideration of
feature encapsulation, *best practices would strive to minimize the
public promotion of actions outside the feature boundary*.

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
(*that simply holds the name*).  Here is an example using
[action-u] (_see: **NOTE** below_):

**`src/feature/featureA/featureName.js`**
```js
export default 'featureA'; // *** NOTE ***
```

**`src/feature/featureA/actions.js`**
```js
import {generateActions} from 'action-u';
import featureName       from './featureName';

export default generateActions.root({
  [featureName]: { // *** NOTE *** prefix all actions with our feature name, guaranteeing they unique app-wide!
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

Within the [redux] framework, [reducers] monitor actions, changing app
state, which in turn triggers UI changes.

Each feature (that maintains state), will define it's own reducer,
maintaining it's own feature-based state (typically a sub-tree of
several items).

While these reducers are opaque assets that maintain state as an
internal detail of the feature, ****feature-u-redux** is interested in
them to the extent that it must combine all feature states into one
overall appState, and in turn register them to redux**.

Each feature (that maintains state) **promotes it's own reducer
through the `reducer` createFeature() parameter**.

Because reducers may require feature-based context information,
**this parameter can also be a contextCB** - *a function that
returns the reducerFn* (please refer to
[managedExpansion()](#managedexpansion) for more information).


#### Sliced Reducers

Because **feature-u-redux** must combine the reducers from all
features into one overall appState, it requires that each reducer be
embellished through the `slicedReducer()` function.  This merely
injects a slice property (interpreted by **feature-u-redux**) on the
reducer function, specifying the location of the reducer within the
top-level appState tree.

As an example, the following definition: 

```js
const currentView = createFeature({
  name:     'currentView',
  reducer:  slicedReducer('view.currentView', currentViewReducer), // *** NOTE ***
  ...
});

const fooBar = createFeature({
  name:     'fooBar',
  reducer:  slicedReducer('view.fooBar', fooBarReducer),           // *** NOTE ***
  ...
});
```

Yields the following overall appState:

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


### Selectors (encapsulating state)

[Selectors] are a best practice which encapsulates the raw nature of
the state shape and business logic interpretation of that state.

Selectors should be used to encapsulate all your state.  Most
selectors should be promoted/used internally within the feature
(defined in close proximity to your reducers).

While feature-u does not directly manage anything about selectors, a
feature may wish to promote some of it's selectors using the
[publicFace](#publicface) feature-u aspect.  Please note that in
consideration of feature encapsulation, *best practices would strive
to minimize the public promotion of feature state (and selectors)
outside the feature boundary*.


#### Single Source of Truth (Feature State Location)

Another benefit of `slicedReducer()` is that not only does it
embellish the reducer with a `slice` property (interpreted by
**feature-u-redux**), it also injects a selector that returns the
slicedState root, given the appState:

```js
reducer.getSlicedState(appState): slicedState
```

In our case this slicedState root is one in the same as your
featureState root, so **as a best practice** it can be used in all
your selectors to further encapsulate this detail (**employing a
single-source-of-truth concept**).

Here is an example:

```js
                             /** Our feature state root (a single-source-of-truth) */
const getFeatureState      = (appState) => reducer.getSlicedState(appState); // *** NOTE ***

                             /** Is device ready to run app */
export const isDeviceReady = (appState) => getFeatureState(appState).status === 'READY';

... more selectors
```


## Interface Points

The primary undertaking of **feature-u-redux** is the creation and
configuration of the redux app store.  The interface to this store
(i.e. it's inputs and outputs) are as follows:

### Inputs

1. **Primary Input**:

   The primary input to **feature-u-redux** is the set of reducers
   that make up the overall application reducer.  This is specified by
   each of your features (that maintain state) through the
   `Feature.reducer` property, containing a `slicedReducer` that
   manages the state of that corresponding feature.

2. **Middleware Integration**:

   Because **feature-u-redux** manages redux, other Aspects can
   promote their redux middleware through the
   Aspect.getReduxMiddleware() API (using an "aspect
   cross-communication mechanism").

### Exposure

1. **Primary Output**:

   The primary way in which redux is exposed to your app is by
   injecting the standard redux
   [`Provider`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#provider-store)
   component at the root of your application DOM.  This enables app
   component access to the redux store (along with it's `dispatch()`
   and `getState()`) through the standard redux
   [`connect()`](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)
   function.

2. **Middleware Integration**:

   Because **feature-u-redux** allows other aspects to inject their
   redux middleware, whatever that middleware exposes is also
   applicable.
   
3. **Other**:

   For good measure, **feature-u-redux** promotes the redux store
   through the `Aspect.getReduxStore()` method (once again, an "aspect
   cross-communication mechanism").  While this may be considered
   somewhat unconventional, it is available should an external process
   need it.


## API

  ?? TODO: DOC AI: generate/interface to this aspect's API

  * [`reducerAspect`](api.md#reducerAspect)
  * [`slicedReducer()`](api.md#slicedReducer)





[action-u]:       https://www.npmjs.com/package/action-u
[actions]:        https://redux.js.org/docs/basics/Actions.html
[reducers]:       https://redux.js.org/docs/basics/Reducers.html
[redux-actions]:  https://www.npmjs.com/package/redux-actions
[redux]:          http://redux.js.org/
[selectors]:      https://gist.github.com/abhiaiyer91/aaf6e325cf7fc5fd5ebc70192a1fa170
