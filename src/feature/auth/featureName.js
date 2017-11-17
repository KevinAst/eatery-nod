/**
 * Expose our featureName through a mini-meta module that is
 * "importable" in all use-cases (a single-source-of-truth).
 *
 * Normally, this information can be obtained from the feature object
 * (i.e. `feature.name`), accessed in one of several ways:
 * 
 *  1. import feature
 *  2. feature-u's injectContext()
 * 
 * Specifically, this featureName.js module is required by actions.js
 * (to prefix all actions with our feature name), as actions.js
 * cannot use either of the techniques above, because:
 *
 *  1. Importing feature is not viable, because actions.js is imported
 *     by other feature assets (like logic.js and state.js), meaning
 *     the feature object is NOT resolved at time of actions.js
 *     expansion
 *
 *  2. feature-u's injectContext() is not supported for actions
 *     because:
 *     a: actions are NOT managed by feature-u, and
 *     b: injectContext() would be problematic for actions (even if it
 *        were somehow supported), because they need to be directly
 *        imported throughout our code-base (without an extra level of
 *        indirection)
 */
export default 'auth';
