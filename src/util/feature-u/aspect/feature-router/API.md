feature-router API
<a name="featureRoute"></a>

## featureRoute(content, [priority]) ⇒ [`routeCB`](#routeCB)
Embellish the supplied content function with a routePriorityproperty - a specification (interpreted by **StateRouter**) as tothe order in which a set of routes (routeCB[]) are executed.A routeCB reasons about the supplied appState, and either returns arendered component screen, or null to allow downstream routes thesame opportunity.  Basically the first non-null return (within allregistered routeCBs) wins.Priorities are integer values that are used to minimize a routesregistration order.  Higher priority routes are given precedence(i.e. executed before lower priority routes).  Routes with the samepriority are executed in their registration order.  While apriority can be any integer number, for your convenience, a smallnumber of PRIORITY constants are provided.While priorities can be used to minimize (or even eliminate) theregistration order, typically an application does in fact rely onregistration order and can operate using a small number ofpriorities.  Priorities are particularly useful within feature-u,where a given feature is provided one registration slot, butrequires it's route logic to execute in different priorities.  Inthat case, the feature can promote multiple routes (an array) eachwith their own priority.**Please Note**: `featureRoute()` accepts named parameters.


| Param | Type | Description |
| --- | --- | --- |
| content | [`routeCB`](#routeCB) | the routeCB to embellish. |
| [priority] | integer | the embellished priority (DEFAULT: PRIORITY.STANDARD or 50). |

**Returns**: [`routeCB`](#routeCB) - the supplied content, embellished with aroutePriority property.  
<a name="routeAspect"></a>

## routeAspect : Aspect
The routeAspect is a **feature-u** plugin that facilitates StateRouterintegration to your features.To use this aspect: 1. Configure the `routeAspect.fallbackElm` representing a    SplashScreen (of sorts) when no routes are in effect. 2. Register `routeAspect` as one of your aspects to    **feature-u**'s `launchApp()`.  3. Specify a `route` `createFeature()` named parameter (_in any    of your features that maintain routes_) referencing a routeCB    or routeCB[] defined by `featureRoute()`.**Please refer to the User Docs** for a complete description withexamples.

<a name="PRIORITY"></a>

## PRIORITY : Object
Route priority defined constants.  This is strictly a convenience,as any integer can be used.Priorities are integer values that are used to minimize a routesregistration order.  Higher priority routes are given precedence(i.e. executed before lower priority routes).  Routes with the samepriority are executed in their registration order.  While apriority can be any integer number, for your convenience, a smallnumber of PRIORITY constants are provided:```jsimport {PRIORITY} from 'feature-router';// usage:PRIORITY.HIGH     // ... 100PRIORITY.STANDARD // ...  50 ... the default (when NOT specified)PRIORITY.LOW      // ...  10```While priorities can be used to minimize (or even eliminate) theregistration order, typically an application does in fact rely onregistration order and can operate using a small number ofpriorities.  Priorities are particularly useful within feature-u,where a given feature is provided one registration slot, butrequires it's route logic to execute in different priorities.  Inthat case, the feature can promote multiple routes (an array) eachwith their own priority.

<a name="routeCB"></a>

## routeCB ⇒ reactElm
A functional callback hook (specified by featureRoute()) thatprovides a generalized run-time API to abstractly expose componentrendering, based on appState. A routeCB reasons about the supplied appState, and either returns arendered component screen, or null to allow downstream routes thesame opportunity.  Basically the first non-null return (within allregistered routeCBs) wins.The routeCB also has a routePriority associated with it.  Priorityroutes are given precedence in their execution order.  In otherwords, the order in which a set of routes (routeCB[]) are executedare 1: routePriority, 2: registration order.  This is useful inminimizing the registration order.**Please Note**: `routeCB()` accepts named parameters.**Also Note**: `app` is actually injected by the routeAspect usingStateRouter's namedDependencies.  However, since feature-u iscurrently the only interface to StateRouter, we document it as partof the routeCB API.


| Param | Type | Description |
| --- | --- | --- |
| app | App | the App object used in feature cross-communication. |
| appState | Any | the top-level application state to reason about. |

**Returns**: reactElm - a rendered component (i.e. react element)representing the screen to display, or null for none (allowingdownstream routes an opportunity).  
