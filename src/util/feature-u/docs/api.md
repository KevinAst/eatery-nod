# API

<br/><br/><br/>

<a id="createFeature"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  createFeature(name, [enabled], [publicAPI], [reducer], [logic], [route], [appWillStart], [appDidStart]) ⇒ Feature</h5>
Create a new Feature object, that accumulates various featureaspects to be consumed by feature-u runApp().Example:```js  import {createFeature} from 'feature-u';  import reducer         from './state';  export default createFeature({    name:       'views',    enabled:    true,    reducer:    shapedReducer('views.currentView', reducer),    ? more  };```**Please Note** `createFeature()` accepts named parameters.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | string |  | the feature name, used in programmatically delineating various features (ex: 'views'). |
| [enabled] | boolean | <code>true</code> | an indicator as to whether this feature is enabled (true) or not (false). |
| [publicAPI] | Any \| contextCallback |  | an optional resource exposed in app.{featureName}.{publicAPI} (emitted from runApp()), promoting cross-communication between features.  Please refer to the feature-u `Public API` documentation for more detail. Because some publicAPI may require feature-based context information, this parameter can also be a contextCallback - a function that returns the publicAPI (see injectContext()). |
| [reducer] | reducerFn \| contextCallback |  | an optional reducer that maintains redux state (if any) for this feature. feature-u patches each reducer into the overall app state, by default using the `feature.name`, but can be explicitly defined through the shapedReducer() (embellishing the reducer with a shape specification).  Please refer to the feature-u `Reducers` documentation for more detail. Because some reducers may require feature-based context information, this parameter can also be a contextCallback - a function that returns the reducerFn (see injectContext()). |
| [logic] | Array.&lt;Logic&gt; \| contextCallback |  | an optional set of business logic modules (if any) to be registered to redux-logic in support of this feature. Please refer to the feature-u `Logic` documentation for more detail. Because some logic modules may require feature-based context information, this parameter can also be a contextCallback - a function that returns the Logic[] (see injectContext()). |
| [route] | Route |  | the optional route callback (see createRoute()) that promotes feature-based top-level screen components based on appState.  Please refer to the feature-u `routes` documentation for more detail. |
| [appWillStart] | function |  | an optional app life-cycle hook invoked one-time at app startup time.  `API: appWillStart(app, children): optional-top-level-content` This life-cycle hook can do any type of initialization, and/or optionally supplement the app's top-level content (using a non-null return).  Please refer to the feature-u `App Life Cycle Hooks` documentation for more detail. |
| [appDidStart] | function |  | an optional app life-cycle hook invoked one-time immediately after app has started.  `API: appDidStart({app, appState, dispatch}): void` Because the app is up-and-running at this time, you have access to the appState and the dispatch function.  Please refer to the feature-u `App Life Cycle Hooks` documentation for more detail. |

**Returns**: Feature - a new Feature object (to be consumed by feature-u runApp()).  

<br/><br/><br/>

<a id="shapedReducer"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  shapedReducer(shape, reducer) ⇒ reducerFn</h5>
Embellish the supplied reducer with a shape property - aspecification (interpreted by feature-u) as to the location of thereducer within the top-level appState tree.Please refer to the Reducers documentation for more information andexamples.SideBar: feature-u will default the location of non-embellished         reducers to the feature name.SideBar: When BOTH shapedReducer() and injectContext() are needed,         shapedReducer() should be adorned in the outer function         passed to createFunction().


| Param | Type | Description |
| --- | --- | --- |
| shape | string | the location of the managed state within the overall top-level appState tree.  This can be a federated namespace (delimited by dots).  Example: `'views.currentView'` |
| reducer | reducerFn | a redux reducer function to be embellished with the shape specification. |

**Returns**: reducerFn - the supplied reducer, embellished with both theshape and a standard selector:```jsreducer.shape: shapereducer.getShapedState(appState): featureState```  

<br/><br/><br/>

<a id="injectContext"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  injectContext(contextCallback) ⇒ function</h5>
Mark the supplied function as a "callback injected with featurecontext", distinguishing it from other functions (such asreducer functions).The callback function should conform to the following signature:```jscontextCallback(feature, app): feature-aspect```Example (reducer):```js  export default injectContext( (feature, app) => combineReducers({...reducer-code-using-feature...} ) );```SideBar: For reducer aspects, when BOTH shapedReducer() and         injectContext() are used, shapedReducer() should be         adorned in the outer function passed to createFunction().Example (logic):```js  export const startAppAuthProcess = injectContext( (feature, app) => createLogic({    ...logic-code-using-feature...  }));```Please refer to the feature-u `injectContext()` documentation for more detail.


| Param | Type | Description |
| --- | --- | --- |
| contextCallback | function | the callback function to be invoked by feature-u with feature context, returning the appropriate feature aspect. |

**Returns**: function - the supplied contextCallback, marked as "callbackinjected with feature context".  

<br/><br/><br/>

<a id="delayExpansion"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  delayExpansion(delayCallback) ⇒ function</h5>
?? BETTER WORDSAlias to `injectContext()` (to show intent), that doesn't needcontext, rather merely delays expansion of an asset, typically toavoid circular import dependencies.The callback function should conform to the following signature:```jsdelayCallback(): feature-aspect```Example (reducer):```js  export default delayExpansion( () => combineReducers({...reducer...} ) );```SideBar: For reducer aspects, when BOTH shapedReducer() and         delayExpansion() are used, shapedReducer() should be         adorned in the outer function passed to createFunction().Example (logic):```js  export const startAppAuthProcess = delayExpansion( () => createLogic({    ...logic...  }));```Please refer to the feature-u `delayExpansion()` documentation for more detail.


| Param | Type | Description |
| --- | --- | --- |
| delayCallback | function | the callback function to be invoked by feature-u, returning the appropriate feature aspect. |

**Returns**: function - the supplied delayCallback, marked appropriatly.  

<br/><br/><br/>

<a id="managedExpansion"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  managedExpansion(contextCB) ⇒ [`contextFnCB`](#contextFnCB)</h5>
Mark the supplied contextCB as a "managed expansion callback",distinguishing it from other functions (such as reducer functions).Managed Expansion Callbacks (i.e. contextCB) are merely functionsthat when invoked, return a featureAspect (ex: reducer, logicmodule, etc.).  In feature-u, you may communicate yourfeatureAspects directly, or through a contextCB.  The latter 1:supports cross-feature communication (through app objectinjection), and 2: minimizes circular dependancy issues (of ES6modules).  Please see the full User Guide for more details on thistopic.??? more specifics in User Guide:In feature-u, you may communicate your featureAspects directly, orthrough a contextCB.  There are two reasons you would use the latter: 1. cross-feature communication (i.e. app object injection)    There are cases where a given featureAspect needs resources    from other features.  This is accomplished through the app    object's promotion of the publicAPI for each feature.  This is    especially useful when the resource is needed during the    expansion of a featureAspect, because feature-u insures all    publicAPI's are resolved prior to other aspects (removing any    order dependency concerns). 2. minimizing circular dependancy issues (of ES6 modules)    There are cases where circular dependancies of ES6 modules are    unavoidable.  Depending on the specifics, this is not    universally bad design - rather one of packaging.    managedExpansion() aids in this process by delaying the    expansion of non-digestable resources until they are absolutely    needed.    As an example, reducers are typically packaged together with    selectors.  There are cases where a selector may be referenced    as part of the expansion of another resource, potentially    causing unresolved references in the expansion of the reducer    (say for example, action references).  This can be aleviated by    delaying the expansion of the reducer, till it is absolutely    needed (i.e. at redux configuration time, controled by    feature-u's runApp()).The contextCB function should conform to the following signature:```jscontextCB(feature, app): FeatureAspect```Example (reducer):```js  export default managedExpansion( (feature, app) => combineReducers({...reducer-code-using-app...} ) );```SideBar: For reducer aspects, when BOTH shapedReducer() and         managedExpansion() are used, shapedReducer() should be         adorned in the outer function passed to createFunction().Example (logic):```js  export const startAppAuthProcess = managedExpansion( (feature, app) => createLogic({    ...logic-code-using-app...  }));```Please refer to the feature-u `managedExpansion()` documentation for more detail.


| Param | Type | Description |
| --- | --- | --- |
| contextCB | [`contextFnCB`](#contextFnCB) | the callback function that when invoked (by feature-u) expands/returns the desired featureAspect. |

**Returns**: [`contextFnCB`](#contextFnCB) - the supplied contextCB, marked as a "managedexpansion callback".  

<br/><br/><br/>

<a id="createRoute"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  createRoute() ⇒ Route</h5>
Create a new Route object, that provides a generalized run-timeAPI to abstractly expose component rendering, based on appState.The Route object contains one or two function callbacks (routeCB), withthe following signature:```js  routeCB(app, appState): rendered-component (null for none)```The routeCB reasons about the supplied appState, and either returns arendered component, or null to allow downstream routes the sameopportunity.  Basically the first non-null return wins.One or two routeCBs can be registered, one with priority and onewithout.  The priority routeCBs are given precedence across allregistered routes before the non-priority routeCBs are invoked.


| Param | Type | Description |
| --- | --- | --- |
| [namedArgs.content] | routeCB | the non-priority route routeCB (if any) ... see: desc above. |
| [namedArgs.priorityContent] | routeCB | the priority route routeCB (if any) ... see: desc above. |

**Returns**: Route - a new Route object (to be consumed by feature-u'sRouter via runApp()).  

<br/><br/><br/>

<a id="runApp"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  runApp(features, api) ⇒ App</h5>
Launch an app by assembling/configuring the supplied app features.The runApp() function manages the configuration of all featureaspects including: actions, logic, reducers, routing, etc.  Inaddition it drives various app life-cycle methods (on the Featureobject), allowing selected features to inject initializationconstructs, etc.The runApp() function maintains an App object, which facilitatescross-communication between features.  The App object is promotedthrough redux-logic inject, and is also returned from this runApp()invocation (which can be exported to facilitate othercommunication).Example:```js  import {runApp} from 'feature-u';  import features from '../features';  export default runApp(features);```


| Param | Type | Description |
| --- | --- | --- |
| features | Array.&lt;Feature&gt; | the features that comprise this application. |
| api | API | an app-specific API object (to be injected into the redux middleware). |

**Returns**: App - an app object which used in featurecross-communication (as follows):```js {   ?? document }```  

<br/><br/><br/>

<a id="contextFnCB"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  contextFnCB ⇒ featureAspect</h5>
A "managed expansion callback" that when invoked (by feature-u)expands/returns the desired featureAspect.


| Param | Type | Description |
| --- | --- | --- |
| app | App | The feature-u app object, promoting the publicAPI of each feature. |

**Returns**: featureAspect - The desired featureAspect (ex: reducer,logic module, etc.).  
