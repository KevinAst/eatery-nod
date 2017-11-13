# API

<br/><br/><br/>

<a id="createFeature"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  createFeature(name, [enabled], [publicAPI], [reducer], [logic], [route], [appWillStart], [appDidStart]) ⇒ Feature</h5>
Create a new Feature object, that accumulates various feature


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
  shapedReducer(reducer, shape) ⇒ reducerFn</h5>
Embellish the supplied reducer with a shape property - a


| Param | Type | Description |
| --- | --- | --- |
| reducer | reducerFn | a redux reducer function to be embellished with the shape specification. |
| shape | string | the location of the managed state within the overall top-level appState tree.  This can be a federated namespace (delimited by dots).  Example: `'views.currentView'` |

**Returns**: reducerFn - the supplied reducer, embellished with both the

<br/><br/><br/>

<a id="injectContext"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  injectContext(contextCallback) ⇒ function</h5>
Mark the supplied function as a "callback injected with feature


| Param | Type | Description |
| --- | --- | --- |
| contextCallback | function | the callback function to be invoked by feature-u with feature context, returning the appropriate feature aspect. |

**Returns**: function - the supplied contextCallback, marked as "callback

<br/><br/><br/>

<a id="createRoute"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  createRoute() ⇒ Route</h5>
Create a new Route object, that provides a generalized run-time


| Param | Type | Description |
| --- | --- | --- |
| [namedArgs.content] | routeCB | the non-priority route routeCB (if any) ... see: desc above. |
| [namedArgs.priorityContent] | routeCB | the priority route routeCB (if any) ... see: desc above. |

**Returns**: Route - a new Route object (to be consumed by feature-u's

<br/><br/><br/>

<a id="runApp"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  runApp(features, api) ⇒ App</h5>
Launch an app by assembling/configuring the supplied app features.


| Param | Type | Description |
| --- | --- | --- |
| features | Array.&lt;Feature&gt; | the features that comprise this application. |
| api | API | an app-specific API object (to be injected into the redux middleware). |

**Returns**: App - an app object which used in feature