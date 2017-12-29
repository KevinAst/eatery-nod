# feature-u-redux API
<a name="slicedReducer"></a>

## slicedReducer(slice, reducer) ⇒ reducerFn
Embellish the supplied reducer with a slice property - a


| Param | Type | Description |
| --- | --- | --- |
| slice | string | the location of the managed state within the overall top-level appState tree.  This can be a federated namespace (delimited by dots).  Example: `'views.currentView'` |
| reducer | reducerFn | a redux reducer function to be embellished with the slice specification. |

**Returns**: reducerFn - the supplied reducer, embellished with both the
<a name="reducerAspect"></a>

## reducerAspect : Aspect
The reducerAspect is a **feature-u** plugin that facilitates redux
