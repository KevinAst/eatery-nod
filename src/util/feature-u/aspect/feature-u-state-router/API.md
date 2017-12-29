# feature-u-state-router API
<a name="createRoute"></a>

## createRoute([content], [priorityContent]) ⇒ Route
Create a new Route object, that provides a generalized run-time


| Param | Type | Description |
| --- | --- | --- |
| [content] | [`routeCB`](#routeCB) | the non-priority route routeCB (if any) ... see: desc above. |
| [priorityContent] | [`routeCB`](#routeCB) | the priority route routeCB (if any) ... see: desc above. |

**Returns**: Route - a new Route object.  
<a name="routeAspect"></a>

## routeAspect : Aspect
The routeAspect is a **feature-u** plugin that facilitates StateRouter

<a name="routeCB"></a>

## routeCB ⇒ reactElm
A functional callback hook (specified in createRoute()) that


| Param | Type | Description |
| --- | --- | --- |
| app | App | the App object used in feature cross-communication. |
| appState | Any | the top-level application state. |

**Returns**: reactElm - a rendered component (i.e. react element)