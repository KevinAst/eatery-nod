# feature-u API
<a name="createFeature"></a>

## createFeature(name, [enabled], [publicFace], [appWillStart], [appDidStart], [pluggableAspects]) ⇒ Feature
Create a new Feature object, accumulating Aspect content to be consumedby launchApp().**Please Note** `createFeature()` accepts named parameters.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | string |  | the feature name, used in programmatically delineating various features (ex: 'views'). |
| [enabled] | boolean | <code>true</code> | an indicator as to whether this feature is enabled (true) or not (false). |
| [publicFace] | Any |  | an optional resource exposed in app.{featureName}.{publicFace} (emitted from launchApp()), promoting cross-communication between features.  Please refer to the feature-u `publicFace` documentation for more detail. |
| [appWillStart] | [`appWillStartFn`](#appWillStartFn) |  | an optional app life-cycle hook invoked one-time at app startup time.  This life-cycle hook can do any type of initialization, and/or optionally supplement the app's top-level content (using a non-null return).  Please refer to the feature-u `App Life Cycle Hooks` documentation for more detail. |
| [appDidStart] | [`appDidStartFn`](#appDidStartFn) |  | an optional app life-cycle hook invoked one-time immediately after app has started.  Because the app is up-and-running at this time, you have access to the appState and the dispatch() function ... assuming you are using redux (when detected by feature-u's plugable aspects).  Please refer to the feature-u `App Life Cycle Hooks` documentation for more detail. |
| [pluggableAspects] | [`Aspect`](#Aspect) |  | additional aspects, as defined by the feature-u's pluggable Aspect extension. |

**Returns**: Feature - a new Feature object (to be consumed by feature-ulaunchApp()).  
<a name="managedExpansion"></a>

## managedExpansion(contextCB) ⇒ [`contextCB`](#contextCB)
Mark the supplied contextCB as a "managed expansion callback",distinguishing it from other functions (such as reducer functions).Managed Expansion Callbacks (i.e. contextCB) are merely functionsthat when invoked, return a FeatureAspect (ex: reducer, logicmodule, etc.).  In feature-u, you may communicate yourFeatureAspects directly, or through a contextCB.  The latter 1:supports cross-feature communication (through app objectinjection), and 2: minimizes circular dependency issues (of ES6modules).  Please see the full User Guide for more details on thistopic.The contextCB function should conform to the following signature:```jscontextCB(app): FeatureAspect```Example (reducer):```js  export default slicedReducer('foo', managedExpansion( (app) => combineReducers({...reducer-code-using-app...} ) ));```SideBar: For reducer aspects, slicedReducer() should always wrap         the the outer function passed to createFunction(), even         when managedExpansion() is used.Example (logic):```js  export const startAppAuthProcess = managedExpansion( (app) => createLogic({    ...logic-code-using-app...  }));```Please refer to the feature-u `managedExpansion()` documentation for more detail.


| Param | Type | Description |
| --- | --- | --- |
| contextCB | [`contextCB`](#contextCB) | the callback function that when invoked (by feature-u) expands/returns the desired FeatureAspect. |

**Returns**: [`contextCB`](#contextCB) - the supplied contextCB, marked as a "managedexpansion callback".  
<a name="launchApp"></a>

## launchApp([aspects], features, registerRootAppElm) ⇒ App
Launch an app by assembling and configuring the supplied features,using the supplied set of pluggable aspects.  - It manages the setup and configuration of all your feature  aspects, including things like: state management, logic, routing,  etc.- It facilitates app life-cycle methods on the Feature object,  allowing features to manage things like: initialization and  inject root UI elements, etc.- It creates and promotes the App object which contains the  publicFace of all features, facilating a cross-communication  between features.Please refer to the user documenation for more details and completeexamples.**Please Note** `launchApp()` accepts named parameters.


| Param | Type | Description |
| --- | --- | --- |
| [aspects] | [`Array.&lt;Aspect&gt;`](#Aspect) | the set of plugable aspects that extend feature-u, integrating other frameworks to match your specific run-time stack.  When NO aspects are supplied (an atypical case), only the very basic feature-u characteristics are in effect (like publicFace and life-cycle hooks). |
| features | Array.&lt;Feature&gt; | the features that comprise this application. |
| registerRootAppElm | [`registerRootAppElmFn`](#registerRootAppElmFn) | the callback hook that registers the supplied root application hook to the specific React framework used by your app.  Because this registration is accomplished by app-specific code, feature-u can operate in any number of containing frameworks, like: React Web, React Native, Expo, etc. |

**Returns**: App - the App object used to promote featurecross-communication.  
<a name="createAspect"></a>

## createAspect(name, [validateConfiguration], [expandFeatureContent], validateFeatureContent, assembleFeatureContent, [assembleAspectResources], [injectRootAppElm], [additionalMethods]) ⇒ [`Aspect`](#Aspect)
Create an Aspect object, used to extend feature-u.**Note on App Promotion**: You will notice that the App object isconsistently supplied thoughout the various Aspect methods.  TheApp object is used in promoting cross-communiction betweenfeatures.  While it is most likely an anti-pattern to interaget theApp object directly in the Aspect, it is needed as to "passthrough" to downwstream processes (i.e. as an opaque object).**This is the reason the App object is supplied**.  As examples ofthis: - The "logic" aspect will dependancy inject (DI) the App object   into the redux-logic process. - The "route" aspect communcates the app in it's API (i.e. passes   it through). - etc.**Please Note**: `createAspect()` accepts named parameters.


| Param | Type | Description |
| --- | --- | --- |
| name | string | the aspect name.  This name is used to "key" aspects of this type in the Feature object: `Feature.{name}: xyz`. As a result, Aspect names must be unique across all aspects that are in-use. |
| [validateConfiguration] | [`validateConfigurationFn`](#validateConfigurationFn) | an optional validation hook allowing this aspect to verify it's own required configuration (if any).  Some aspects may require certain settings in self for them to operate. |
| [expandFeatureContent] | [`expandFeatureContentFn`](#expandFeatureContentFn) | an optional aspect expansion hook, defaulting to the algorithm defined by managedExpansion().  This function rarely needs to be overridden. It provides a hook to aspects that need to transfer additional content from the expansion function to the expanded content. |
| validateFeatureContent | [`validateFeatureContentFn`](#validateFeatureContentFn) | a validation hook allowing this aspect to verify it's content on the supplied feature (which is known to contain this aspect). |
| assembleFeatureContent | [`assembleFeatureContentFn`](#assembleFeatureContentFn) | the required Aspect method that assembles content for this aspect across all features, retaining needed state for subsequent ops. This method is required because this is the primary task that is accomplished by all aspects. |
| [assembleAspectResources] | [`assembleAspectResourcesFn`](#assembleAspectResourcesFn) | an optional Aspect method that assemble resources for this aspect across all other aspects, retaining needed state for subsequent ops.  This hook is executed after all the aspects have assembled their feature content (i.e. after `assembleFeatureContent()`). |
| [injectRootAppElm] | [`injectRootAppElmFn`](#injectRootAppElmFn) | an optional callback hook that promotes some characteristic of this aspect within the app root element (i.e. react component instance). |
| [additionalMethods] | Any | additional methods (proprietary to specific Aspects), supporting two different requirements: <ol> <li> internal Aspect helper methods, and <li> APIs used in "aspect cross-communication" ... a contract      between one or more aspects.  This is merely an API specified      by one Aspect, and used by another Aspect, that is facilitate      through the `Aspect.assembleAspectResources(aspects, app)`      hook. </ol> |

**Returns**: [`Aspect`](#Aspect) - a new Aspect object (to be consumed by launchApp()).  
<a name="appWillStartFn"></a>

## appWillStartFn ⇒ reactElm
An optional app life-cycle hook invoked one-time at app startuptime.This life-cycle hook can do any type of initialization. Forexample: initialize FireBase.In addition, this life-cycle hook can optionally supplement theapp's top-level content (using a non-null return). Typically,nothing is returned (i.e. falsy). However any return value isinterpreted as the content to inject at the top of the app, betweenthe redux Provider and feature-u's Router.  **IMPORTANT**: If youreturn top-level content, the supplied curRootAppElm MUST beincluded as part of this definition (this accommodates theaccumulative process of other feature injections)!


| Param | Type | Description |
| --- | --- | --- |
| app | App | the App object used in feature cross-communication. |
| curRootAppElm | reactElm | the current react app element root. |

**Returns**: reactElm - optionally, new top-level content (which in turnmust contain the supplied curRootAppElm), or falsy for unchanged.  
<a name="appDidStartFn"></a>

## appDidStartFn : function
An optional app life-cycle hook invoked one-time immediately afterapp has started.Because the app is up-and-running at this time, you have access tothe appState and dispatch() function ... assuming you are usingredux (when detected by feature-u's plugable aspects).**Please Note** `appDidStart()` utilizes named parameters.


| Param | Type | Description |
| --- | --- | --- |
| app | App | the App object used in feature cross-communication. |
| [appState] | Any | the redux top-level app state (when redux is in use). |
| [dispatch] | function | the redux dispatch() function (when redux is in use). |

<a name="contextCB"></a>

## contextCB ⇒ FeatureAspect
A "managed expansion callback" (defined by managedExpansion) thatwhen invoked (by feature-u) expands and returns the desiredFeatureAspect.


| Param | Type | Description |
| --- | --- | --- |
| app | App | The feature-u app object, promoting the publicFace of each feature. |

**Returns**: FeatureAspect - The desired FeatureAspect (ex: reducer,logic module, etc.).  
<a name="registerRootAppElmFn"></a>

## registerRootAppElmFn : function
The launchApp() callback hook that registers the supplied rootapplication hook to the specific React framework used by your app.Because this registration is accomplished by app-specific code,feature-u can operate in any number of containing frameworks, like:React Web, React Native, Expo, etc.**NOTE on rootAppElm:**- Typically the supplied rootAppElm will have definition, based on  the Aspects and Features that are in use.  In this case, it is the  responsibility of this callback to register this content in  some way (either directly or indirectly).- However, there are atypical isolated cases where the supplied  rootAppElm can be null.  This can happen when the app chooses NOT  to use Aspects/Features that inject any UI content.  In this case,  the callback is free to register it's own content.Please refer to the user documentation for more details andcomplete examples.


| Param | Type | Description |
| --- | --- | --- |
| rootAppElm | reactElm | the root application element to be registered. |

<a name="Aspect"></a>

## Aspect : Any
Aspect objects (emitted from `createAspect()`) are used to extendfeature-u.

<a name="validateConfigurationFn"></a>

## validateConfigurationFn ⇒ string
A validation hook allowing this aspect to verify it's own requiredconfiguration (if any).  Some aspects may require certain settingsin self for them to operate.NOTE: To better understand the context in which any returned      validation messages are used, feature-u will prefix them      with: 'launchApp() parameter violation: '

**Returns**: string - an error message when self is in an invalid state(falsy when valid).  
<a name="expandFeatureContentFn"></a>

## expandFeatureContentFn ⇒ string
Expand self's content in the supplied feature, replacing thatcontent (within the feature).  Once expansion is complete,feature-u will perform a delayed validation of the expandedcontent.The default behavior simply implements the expansion algorithmdefined by managedExpansion():```jsfeature[this.name] = feature[this.name](app);```This default behavior rarely needs to change.  It however providesa hook for aspects that need to transfer additional content fromthe expansion function to the expanded content.  As an example, the`reducer` aspect must transfer the slice property from theexpansion function to the expanded reducer.


| Param | Type | Description |
| --- | --- | --- |
| feature | Feature | the feature which is known to contain this aspect **and** is in need of expansion (as defined by managedExpansion()). |
| app | App | the App object used in feature cross-communication. |

**Returns**: string - an optional error message when the suppliedfeature contains invalid content for this aspect (falsy whenvalid).  This is a specialized validation of the expansionfunction, over-and-above what is checked in the standardvalidateFeatureContent() hook.  
<a name="validateFeatureContentFn"></a>

## validateFeatureContentFn ⇒ string
A validation hook allowing this aspect to verify it's content onthe supplied feature.NOTE: To better understand the context in which any returned      validation messages are used, feature-u will prefix them      with: 'createFeature() parameter violation: '


| Param | Type | Description |
| --- | --- | --- |
| feature | Feature | the feature to validate, which is known to contain this aspect. |

**Returns**: string - an error message when the supplied featurecontains invalid content for this aspect (falsy when valid).  
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
| aspects | [`Array.&lt;Aspect&gt;`](#Aspect) | The set of feature-u Aspect objects used in this this application. |
| app | App | the App object used in feature cross-communication. |

<a name="injectRootAppElmFn"></a>

## injectRootAppElmFn ⇒ reactElm
An optional callback hook that promotes some characteristic of thisaspect within the app root element (i.e. react component instance).All aspects will either promote themselves through this hook, -or-through some "aspect cross-communication" mechanism.**NOTE**: When this hook is used, the supplied curRootAppElm MUST beincluded as part of this definition!


| Param | Type | Description |
| --- | --- | --- |
| curRootAppElm | reactElm | the current react app element root. |
| app | App | the App object used in feature cross-communication. |
| activeFeatures | Array.&lt;Feature&gt; | The set of active (enabled) features that comprise this application.  This can be used in an optional Aspect/Feature cross-communication.  As an example, an Xyz Aspect may define a Feature API by which a Feature can inject DOM in conjunction with the Xyz Aspect DOM injection. |

**Returns**: reactElm - a new react app element root (which in turn mustcontain the supplied curRootAppElm), or simply the suppliedcurRootAppElm (if no change).  
