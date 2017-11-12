# API

<br/><br/><br/>

<a id="createFeature"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  createFeature(name, [enabled], [publicAPI], [reducer], [logic], [route], [appWillStart], [appDidStart]) ⇒ Feature</h5>
Create a new Feature object, that accumulates various featureaspects to be consumed by feature-u runApp().Example:```js  import {createFeature} from 'feature-u';  import reducer         from './state';  export default createFeature({    name:       'views',    enabled:    true,    reducer:    shapedReducer(reducer, 'views.currentView'),    ? more  };```


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | string |  | the feature name, used in programmatically delineating various features (ex: 'views'). |
| [enabled] | boolean | <code>true</code> | an indicator as to whether this feature is enabled (true) or not (false). |
| [publicAPI] | Any \| contextCallback |  | an optional resource exposed in app.{featureName}.{publicAPI} (emitted from runApp()), promoting cross-communication between features.  Please refer to the feature-u `Public API` documentation for more detail. Because some publicAPI may require feature-based context information, this parameter can also be a contextCallback - a function that returns the publicAPI (see injectContext()). |
| [reducer] | reducerFn \| contextCallback |  | an optional reducer that maintains redux state (if any) for this feature. feature-u patches each reducer into the overall app state, by default using the `feature.name`, but can be explicitly defined through the shapedReducer() (embellishing the reducer with a shape specification).  Please refer to the feature-u `Reducers` documentation for more detail. Because some reducers may require feature-based context information, this parameter can also be a contextCallback - a function that returns the reducerFn (see injectContext()). |
| [logic] | Array.&lt;Logic&gt; \| contextCallback |  | an optional set of business logic modules (if any) to be registered to redux-logic in support of this feature. Please refer to the feature-u `Logic` documentation for more detail. Because some logic modules may require feature-based context information, this parameter can also be a contextCallback - a function that returns the Logic[] (see injectContext()). |
| [route] | Route |  | the optional route callback (see createRoute()) that promotes feature-based top-level screen components based on appState.  Please refer to the feature-u `routes` documentation for more detail. |
| [appWillStart] | function |  | an optional app life-cycle callback invoked one-time at app startup time.  This life-cycle callback can do any type of initialization, and/or optionally supplement the app's top-level content (using a non-null return).   ```   API: appWillStart(app, children): optional-top-level-content (null for none) ``` Normally, this callback doesn't return anything (i.e. undefined). However any return value is interpreted as the content to inject at the top of the app (between the redux Provider and feature-u's Router.  IMPORTANT: If you return top-level content, it is your responsiblity to include the supplied children in your render. Otherwise NO app content will be displayed (because children contains the feature-u Router, which decides what screen to display). Here is an example of injecting new root-level content: ```js appWillStart(app, children) {   ... other initialization ...   return (     <Drawer ...>       {children}     </Drawer>   ); } ``` Here is an example of injecting a new sibling to children: ```js appWillStart: (app, children) => [React.Children.toArray(children), <Notify key="Notify"/>] ``` |
| [appDidStart] | function |  | an optional app life-cycle callback invoked one-time immediatly after app has started. ```   API: appDidStart({app, appState, dispatch}): void ``` |

**Returns**: Feature - a new Feature object (to be consumed by feature-u runApp()).  

<br/><br/><br/>

<a id="shapedReducer"></a>

<h5 style="margin: 10px 0px; border-width: 5px 0px; padding: 5px; border-style: solid;">
  shapedReducer(reducer, shape) ⇒ reducerFn</h5>
Embellish the supplied reducer with a shape property - aspecification (interpreted by feature-u) as to the location of thereducer within the top-level appState tree.Please refer to the Reducers documentation for more information andexamples.SideBar: feature-u will default the location of non-embellished         reducers to the feature name.SideBar: When BOTH shapedReducer() and injectContext() are needed,         shapedReducer() should be adorned in the outer function         passed to createFunction().


| Param | Type | Description |
| --- | --- | --- |
| reducer | reducerFn | a redux reducer function to be embellished with the shape specification. |
| shape | string | the location of the managed state within the overall top-level appState tree.  This can be a federated namespace (delimited by dots).  Example: `'views.currentView'` |

**Returns**: reducerFn - the supplied reducer, embellished with both theshape and a standard selector:```jsreducer.shape: shapereducer.getShapedState(appState): featureState```  

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
