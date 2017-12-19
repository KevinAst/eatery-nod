# feature-u API
<a name="createFeature"></a>

## createFeature(name, [enabled], [publicFace], [reducer], [logic], [route], [appWillStart], [appDidStart]) ⇒ Feature
Create a new Feature object, accumulating Aspect data to be consumedby launchApp().Example:```js  import {createFeature} from 'feature-u';  import reducer         from './state';  export default createFeature({    name:       'views',    enabled:    true,    reducer:    slicedReducer('views.currentView', reducer),    ?? expand this a bit  };```**Please Note** `createFeature()` accepts named parameters.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | string |  | the feature name, used in programmatically delineating various features (ex: 'views'). |
| [enabled] | boolean | <code>true</code> | an indicator as to whether this feature is enabled (true) or not (false). |
| [publicFace] | Any \| [`contextCB`](#contextCB) |  | an optional resource exposed in app.{featureName}.{publicFace} (emitted from runApp()), promoting cross-communication between features.  Please refer to the feature-u `publicFace` documentation for more detail. Because some publicFace may require feature-based context information, this parameter may also be a contextCB - a function that returns the publicFace (see managedExpansion()). |
| [reducer] | reducerFn \| [`contextCB`](#contextCB) |  | an optional reducer that maintains redux state (if any) for this feature. The reducers from all features are combined into one overall app state, through a required slice specification, embellished on the reducer through the slicedReducer() function.  Please refer to the feature-u `Reducers` documentation for more detail. Because some reducers may require feature-based context information, this parameter may also be a contextCB - a function that returns the reducerFn (see managedExpansion()). |
| [logic] | Array.&lt;Logic&gt; \| [`contextCB`](#contextCB) |  | an optional set of business logic modules (if any) to be registered to redux-logic in support of this feature. Please refer to the feature-u `Logic` documentation for more detail. Because some logic modules may require feature-based context information, this parameter may also be a contextCB - a function that returns the Logic[] (see managedExpansion()). |
| [route] | Route |  | the optional route callback (see createRoute()) that promotes feature-based top-level screen components based on appState.  Please refer to the feature-u `routes` documentation for more detail. |
| [appWillStart] | function |  | an optional app life-cycle hook invoked one-time at app startup time.  `API: appWillStart(app, children): optional-top-level-content` This life-cycle hook can do any type of initialization, and/or optionally supplement the app's top-level content (using a non-null return).  Please refer to the feature-u `App Life Cycle Hooks` documentation for more detail. |
| [appDidStart] | function |  | an optional app life-cycle hook invoked one-time immediately after app has started.  `API: appDidStart({app, appState, dispatch}): void` Because the app is up-and-running at this time, you have access to the appState and the dispatch function.  Please refer to the feature-u `App Life Cycle Hooks` documentation for more detail. |

**Returns**: Feature - a new Feature object (to be consumed by feature-u runApp()).  
<a name="slicedReducer"></a>

## slicedReducer(slice, reducer) ⇒ reducerFn
Embellish the supplied reducer with a slice property - aspecification (interpreted by feature-u) as to the location of thereducer within the top-level appState tree.Please refer to the full documentation for more information andexamples.SideBar: For reducer aspects, slicedReducer() should always wrap         the the outer function passed to createFeature(), even         when managedExpansion() is used.


| Param | Type | Description |
| --- | --- | --- |
| slice | string | the location of the managed state within the overall top-level appState tree.  This can be a federated namespace (delimited by dots).  Example: `'views.currentView'` |
| reducer | reducerFn | a redux reducer function to be embellished with the slice specification. |

**Returns**: reducerFn - the supplied reducer, embellished with both theslice and a selector:```jsreducer.slice: slicereducer.getSlicedState(appState): slicedState```  
<a name="managedExpansion"></a>

## managedExpansion(contextCB) ⇒ [`contextCB`](#contextCB)
Mark the supplied contextCB as a "managed expansion callback",distinguishing it from other functions (such as reducer functions).Managed Expansion Callbacks (i.e. contextCB) are merely functionsthat when invoked, return a FeatureAspect (ex: reducer, logicmodule, etc.).  In feature-u, you may communicate yourFeatureAspects directly, or through a contextCB.  The latter 1:supports cross-feature communication (through app objectinjection), and 2: minimizes circular dependency issues (of ES6modules).  Please see the full User Guide for more details on thistopic.The contextCB function should conform to the following signature:```jscontextCB(app): FeatureAspect```Example (reducer):```js  export default slicedReducer('foo', managedExpansion( (app) => combineReducers({...reducer-code-using-app...} ) ));```SideBar: For reducer aspects, slicedReducer() should always wrap         the the outer function passed to createFunction(), even         when managedExpansion() is used.Example (logic):```js  export const startAppAuthProcess = managedExpansion( (app) => createLogic({    ...logic-code-using-app...  }));```Please refer to the feature-u `managedExpansion()` documentation for more detail.


| Param | Type | Description |
| --- | --- | --- |
| contextCB | [`contextCB`](#contextCB) | the callback function that when invoked (by feature-u) expands/returns the desired FeatureAspect. |

**Returns**: [`contextCB`](#contextCB) - the supplied contextCB, marked as a "managedexpansion callback".  
<a name="createRoute"></a>

## createRoute() ⇒ Route
Create a new Route object, that provides a generalized run-timeAPI to abstractly expose component rendering, based on appState.The Route object contains one or two function callbacks (routeCB), withthe following signature:```js  routeCB(app, appState): rendered-component (null for none)```The routeCB reasons about the supplied appState, and either returns arendered component, or null to allow downstream routes the sameopportunity.  Basically the first non-null return wins.One or two routeCBs can be registered, one with priority and onewithout.  The priority routeCBs are given precedence across allregistered routes before the non-priority routeCBs are invoked, andare useful in some cases to minimize the feature registrationorder.


| Param | Type | Description |
| --- | --- | --- |
| [namedArgs.content] | routeCB | the non-priority route routeCB (if any) ... see: desc above. |
| [namedArgs.priorityContent] | routeCB | the priority route routeCB (if any) ... see: desc above. |

**Returns**: Route - a new Route object (to be consumed by feature-u'sRouter via runApp()).  
<a name="runApp"></a>

## runApp(features) ⇒ App
Launch an app by assembling/configuring the supplied app features.The runApp() function manages the configuration of all featureaspects including: actions, logic, reducers, routing, etc.  Inaddition it drives various app life-cycle methods (on the Featureobject), allowing selected features to inject initializationconstructs, etc.The runApp() function maintains an App object, which facilitatescross-communication between features.  The App object is promotedthrough redux-logic inject, and is also returned from this runApp()invocation (which can be exported to facilitate othercommunication).Example:```js  import {runApp} from 'feature-u';  import features from '../features';  export default runApp(features);```


| Param | Type | Description |
| --- | --- | --- |
| features | Array.&lt;Feature&gt; | the features that comprise this application. |

**Returns**: App - an app object which used in featurecross-communication (as follows):```js {   ?? document }```  
<a name="createAspect"></a>

## createAspect(name, validateFeatureContent, assembleFeatureContent, [assembleAspectResources], [injectRootAppElm], [additionalMethods]) ⇒ Aspect
Create an Aspect object, used to extend feature-u.**Note on App Promotion**: You will notice that the App object isconsistently supplied thoughout the various Aspect methods.  TheApp object is used in promoting cross-communiction betweenfeatures.  While it is most likely an anti-pattern to interaget theApp object directly in the Aspect, it is needed as to "passthrough" to downwstream processes (i.e. as an opaque object).**This is the reason the App object is supplied**.  As examples ofthis: - The "logic" aspect will dependancy inject (DI) the App object   into the redux-logic process. - The "route" aspect communcates the app in it's API (i.e. passes   it through). - etc.**Please Note**: `createAspect()` accepts named parameters.


| Param | Type | Description |
| --- | --- | --- |
| name | string | the aspect name.  This name is used to "key" aspects of this type in the Feature object: `Feature.{name}: xyz`. As a result, Aspect names must be unique across all aspects that are in-use. |
| validateFeatureContent | [`validateFeatureContentFn`](#validateFeatureContentFn) | a validation hook allowing this aspect to verify it's content on the supplied feature (which is known to contain this aspect). |
| assembleFeatureContent | [`assembleFeatureContentFn`](#assembleFeatureContentFn) | the required Aspect method that assembles content for this aspect across all features, retaining needed state for subsequent ops. This method is required because this is the primary task that is accomplished by all aspects. |
| [assembleAspectResources] | [`assembleAspectResourcesFn`](#assembleAspectResourcesFn) | an optional Aspect method that assemble resources for this aspect across all other aspects, retaining needed state for subsequent ops.  This hook is executed after all the aspects have assembled their feature content (i.e. after `assembleFeatureContent()`). |
| [injectRootAppElm] | [`injectRootAppElmFn`](#injectRootAppElmFn) | an optional callback hook that promotes some characteristic of this aspect within the app root element (i.e. react component instance). |
| [additionalMethods] | Any | additional methods (proprietary to specific Aspects), supporting two different requirements: <ol> <li> internal Aspect helper methods, and <li> APIs used in "aspect cross-communication" ... a contract      between one or more aspects.  This is merely an API specified      by one Aspect, and used by another Aspect, that is facilitate      through the `Aspect.assembleAspectResources(aspects, app)`      hook. </ol> |

**Returns**: Aspect - a new Aspect object (to be consumed by launchApp()).  
<a name="FeatureAspect"></a>

## FeatureAspect : \*
In feature-u, "aspects" (FeatureAspect) is a general term used to refer to thevarious ingredients that, when combined, constitute your app. A FeatureAspect can refere to actions, reducers, components,routes, logic, etc.

<a name="contextCB"></a>

## contextCB ⇒ [`FeatureAspect`](#FeatureAspect)
A "managed expansion callback" (defined by managedExpansion) thatwhen invoked (by feature-u) expands and returns the desiredFeatureAspect.


| Param | Type | Description |
| --- | --- | --- |
| app | App | The feature-u app object, promoting the publicFace of each feature. |

**Returns**: [`FeatureAspect`](#FeatureAspect) - The desired FeatureAspect (ex: reducer,logic module, etc.).  
<a name="validateFeatureContentFn"></a>

## validateFeatureContentFn ⇒ string
A validation hook allowing this aspect to verify it's content onthe supplied feature.NOTE: To better understand the context in which any returned      validation messages are used, feature-u will prefix them      with: 'createFeature() parameter violation: '


| Param | Type | Description |
| --- | --- | --- |
| feature | Feature | the feature to validate, which is known to contain this aspect. |

**Returns**: string - an error message when the supplied featurecontains invalid content for this aspect (null when valid).  
<a name="assembleFeatureContentFn"></a>

## assembleFeatureContentFn : function
The required Aspect method that assembles content for this aspectacross all features, retaining needed state for subsequent ops.This method is required because this is the primary task that isaccomplished by all aspects.


| Param | Type | Description |
| --- | --- | --- |
| activeFeatures | Array.&lt;Feature&gt; | The set of active (enabled) features that comprise this application. |
| app | App | the App object used in feature cross-communication. |

<a name="assembleAspectResourcesFn"></a>

## assembleAspectResourcesFn : function
An optional Aspect method that assemble resources for this aspectacross all other aspects, retaining needed state for subsequentops.  This hook is executed after all the aspects have assembledtheir feature content (i.e. after `assembleFeatureContent()`).This is an optional second-pass (so-to-speak) of Aspect datagathering, that facilitates an "aspect cross-communication"mechanism.  It allows a given aspect to gather resources from otheraspects, through a documented API for a given Aspect (ex:Aspect.getXyz()).As an example of this, the "reducer" aspect (which manages redux),allows other aspects to inject their own redux middleware (ex:redux-logic), through it's documented Aspect.getReduxMiddleware()API.


| Param | Type | Description |
| --- | --- | --- |
| aspects | Array.&lt;Aspect&gt; | The set of feature-u Aspect objects used in this this application. |
| app | App | the App object used in feature cross-communication. |

<a name="injectRootAppElmFn"></a>

## injectRootAppElmFn ⇒ reactElm
An optional callback hook that promotes some characteristic of thisaspect within the app root element (i.e. react component instance).All aspects will either promote themselves through this hook, -or-through some "aspect cross-communication" mechanism.**NOTE**: When this hook is used, the supplied curRootAppElm MUST beincluded as part of this definition!


| Param | Type | Description |
| --- | --- | --- |
| curRootAppElm | reactElm | the current react app element root. |
| app | App | the App object used in feature cross-communication. |

**Returns**: reactElm - a new react app element root (which in turn mustcontain the supplied curRootAppElm), or simply the suppliedcurRootAppElm (if no change).  
