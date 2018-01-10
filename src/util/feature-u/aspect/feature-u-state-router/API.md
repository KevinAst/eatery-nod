# feature-u-state-router API
<a name="prioritizedRoute"></a>

## prioritizedRoute(content, [priority]) ⇒ [`routeCB`](#routeCB)
Embellish the supplied content with a routePriority property - aspecification (interpreted by **StateRouter**) as to the order inwhich a set of routes (routeCB[]) are executed.A routeCB reasons about the supplied appState, and either returns arendered component screen, or null to allow downstream routes thesame opportunity.  Basically the first non-null return (within allregistered routeCBs) wins.Priority is an integer value.  Higher priority routes are givenprecedence (i.e. executed before lower priority routes). This isuseful in minimizing the registration order.Typically an application can operate with just 2 priorites.  While apriority can be any integer number, for your convenience thefollowing constants are provided:```jsimport {PRIORITY} from 'feature-u-state-router';// usage:PRIORITY.HIGH     // ... 100PRIORITY.STANDARD // ...  50 ... the default (when NOT specified)PRIORITY.LOW      // ...  10```**Please Note**: `prioritizedRoute()` accepts named parameters.


| Param | Type | Description |
| --- | --- | --- |
| content | [`routeCB`](#routeCB) | the routeCB to embellish. |
| [priority] | integer | the embellished priority (DEFAULT: PRIORITY.STANDARD or 50). |

**Returns**: [`routeCB`](#routeCB) - the supplied content, embellished with aroutePriority property.  
<a name="routeAspect"></a>

## routeAspect : Aspect
The routeAspect is a **feature-u** plugin that facilitates StateRouterintegration to your features.To use this aspect: 1. Configure the `routeAspect.fallbackElm` representing a    SplashScreen (of sorts) when no routes are in effect. 2. Register `routeAspect` as one of your aspects to    **feature-u**'s `launchApp()`.  3. Specify a `route` `createFeature()` named parameter (_in any    of your features that maintain routes_) referencing a routeCB    or routeCB[] defined by `prioritizedRoute()`.**Please refer to the User Docs** for a complete description withexamples.

<a name="PRIORITY"></a>

## PRIORITY : Object
Route priority defined constants.  This is strictly a convenience,as any integer can be used.A route priority is an integer value that specifies the order inwhich a set of routes (routeCB[]) are executed.  Higher priorityroutes are given precedence (i.e. executed before lower priorityroutes). This is useful in minimizing the registration order.Typically an application can operate with just 2 priorities.  Whilea priority can be any integer number, for your convenience thefollowing constants are provided:```jsimport {PRIORITY} from 'feature-u-state-router';// usage:PRIORITY.HIGH     // ... 100PRIORITY.STANDARD // ...  50 ... the default (when NOT specified)PRIORITY.LOW      // ...  10```

<a name="routeCB"></a>

## routeCB ⇒ reactElm
A functional callback hook (specified by prioritizedRoute()) thatprovides a generalized run-time API to abstractly expose componentrendering, based on appState. A routeCB reasons about the supplied appState, and either returns arendered component screen, or null to allow downstream routes thesame opportunity.  Basically the first non-null return (within allregistered routeCBs) wins.Priority routes are given precedence in their execution order.In other words, the order in which a set of routes (routeCB[]) areexecuted are 1: routePriority, 2: registration order.  This isuseful in minimizing the registration order.**Please Note**: `routeCB()` accepts named parameters.**Also Note**: `app` is actually injected by the routeAspect usingStateRouter's namedDependencies.  However, since feature-u iscurrently the only interface to StateRouter, we document it as partof the routeCB API.


| Param | Type | Description |
| --- | --- | --- |
| app | App | the App object used in feature cross-communication. |
| appState | Any | the top-level application state to reason about. |

**Returns**: reactElm - a rendered component (i.e. react element)representing the screen to display, or null for none (allowingdownstream routes an opportunity).  
