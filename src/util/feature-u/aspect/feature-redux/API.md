feature-redux API
<a name="expandFeatureContent"></a>

## expandFeatureContent(app, feature) ⇒ string
Expand the reducer content in the supplied feature -AND- transferthe slice property from the expansion function to the expandedreducer.


| Param | Type | Description |
| --- | --- | --- |
| app | App | the App object used in feature cross-communication. |
| feature | Feature | the feature which is known to contain this aspect **and** is in need of expansion (as defined by managedExpansion()). |

**Returns**: string - an optional error message when the suppliedfeature contains invalid content for this aspect (falsy whenvalid).  This is a specialized validation of the expansionfunction, over-and-above what is checked in the standardvalidateFeatureContent() hook.  
<a name="slicedReducer"></a>

## slicedReducer(slice, reducer) ⇒ reducerFn
Embellish the supplied reducer with a slice property - aspecification (interpreted by **feature-redux**) as to thelocation of the reducer within the top-level appState tree.**Please refer to the User Docs** for a complete description withexamples.**SideBar**: For reducer aspects, `slicedReducer()` should always             wrap the the outer function passed to             `createFeature()`, even when `managedExpansion()` is             used.  This gives your app code access to the             embellished `getSlicedState()` selector, even prior to             expansion occurring (_used as a single-source-of-truth             in your selector definitions_).


| Param | Type | Description |
| --- | --- | --- |
| slice | string | the location of the managed state within the overall top-level appState tree.  This can be a federated namespace (delimited by dots).  Example: `'views.currentView'` |
| reducer | reducerFn | a redux reducer function to be embellished with the slice specification. |

**Returns**: reducerFn - the supplied reducer, embellished with both theslice and a convenience selector:```jsreducer.slice: slicereducer.getSlicedState(appState): slicedState```  
<a name="reducerAspect"></a>

## reducerAspect : Aspect
The reducerAspect is a **feature-u** plugin that facilitates reduxintegration to your features.To use this aspect: 1. Register it as one of your aspects to **feature-u**'s `launchApp()`.  2. Specify a `reducer` `createFeature()` named parameter (_in any    of your features that maintain state_) referencing the reducer    function that manages the feature state.     Because your feature state is combined into one overall    appState (for all features), the reducer must identify it's    root location, through the `slicedReducer()` function.**Please refer to the User Docs** for a complete description withexamples.

