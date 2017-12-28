# feature-u-state-router API
<a name="createRoute"></a>

## createRoute([content], [priorityContent]) ⇒ Route
Create a new Route object, that provides a generalized run-timeAPI to abstractly expose component rendering, based on appState.The Route object contains one or two function callbacks (routeCB), withthe following signature:```js  routeCB(app, appState): rendered-component (null for none)```The routeCB reasons about the supplied appState, and either returns arendered component, or null to allow downstream routes the sameopportunity.  Basically the first non-null return wins.One or two routeCBs can be registered, one with priority and onewithout.  The priority routeCBs are given precedence across allregistered routes before the non-priority routeCBs are invoked, andare useful in some cases to minimize the feature registrationorder.**Aspect Configuration** ... see User Guide for details1. fallbackElm (REQUIRED): the fallback elm representing a   SplashScreen (of sorts) when no routes are in effect.2. componentWillUpdateHook (OPTIONAL): invoked in   componentWillUpdate() life-cycle hook.  Initially developed to   support ReactNative animation.**Please Note**: `createRoute()` accepts named parameters.


| Param | Type | Description |
| --- | --- | --- |
| [content] | [`routeCB`](#routeCB) | the non-priority route routeCB (if any) ... see: desc above. |
| [priorityContent] | [`routeCB`](#routeCB) | the priority route routeCB (if any) ... see: desc above. |

**Returns**: Route - a new Route object.  
<a name="routeAspect"></a>

## routeAspect : Aspect
The routeAspect is a **feature-u** plugin that facilitates StateRouterintegration to your features.To use this aspect: 1. Configure the `routeAspect.fallbackElm` representing a    SplashScreen (of sorts) when no routes are in effect. 2. Register `routeAspect` as one of your aspects to    **feature-u**'s `launchApp()`.  3. Specify a `route` `createFeature()` named parameter (_in any    of your features that maintain routes_) referencing a route     defined by `createRoute()`.**Please refer to the User Docs** for a complete description withexamples.

<a name="routeCB"></a>

## routeCB ⇒ reactElm
A functional callback hook (specified in createRoute()) thatreasons about the supplied appState, and either returns a renderedcomponent screen, or null to allow downstream routes the sameopportunity.Basically the first non-null return (within all registeredrouteCBs) wins.One or two routeCBs can be registered (through createRoute()), onewith priority and one without.  The priority routeCBs are givenprecedence across all registered routes before the non-priorityrouteCBs are invoked, and are useful in some cases to minimize thefeature registration order.


| Param | Type | Description |
| --- | --- | --- |
| app | App | the App object used in feature cross-communication. |
| appState | Any | the top-level application state. |

**Returns**: reactElm - a rendered component (i.e. react element)representing the screen to display, or null for none (allowingdownstream routes an opportunity).  
