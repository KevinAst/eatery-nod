import {reducerHash}  from 'astx-redux-util';
import {createLogic}  from 'redux-logic';
import isString       from 'lodash.isstring';
import isFunction     from 'lodash.isfunction';
import verify         from '../verify';

/**
 * Define the characteristics of an Intelligent Form - a reusable forms
 * utility that is logic-based (using redux-logic).
 * 
 * A form schema provides the details about the form fields (field names,
 * labels, validation, etc.).  This schema is driven by Yup (a
 * light-weight Joi), so it is declarative and dead simple!
 * 
 * Complete aspects of the form is auto generated, including actions,
 * logic, and reducers.  These auto-generated items implement the hard
 * work related to dynamically determining when fields should be
 * validated (based on user touches, and form submission).
 * 
 * In addition, a series of intelligent-form-based input form elements
 * are available.  These components auto-wire to the actions/state of an
 * IForm, and automatically expose validation msgs at the appropriate
 * time (considering user touches and form submission, etc.).
 * 
 * Bottom line is that re-usability is promoted in a dead simple way.
 * And as a bonus, because it is redux-logic-based, it is extremely
 * simple to inject app-specific logic to manipulate various
 * business-related items.
 *
 * @param {string} namedArgs.formDesc a human-interpretable description for
 * this form (ex: 'Sign In').
 *
 * @param {ObjectSchema} namedArgs.formSchema the Yup Schema object defining
 * form fields, labels, and validation characteristics.
 *
 * @param {function} namedArgs.selectFormState a selector function
 * that promotes our specific formState, given the top-level appState.
 * API: (appState) => formState
 *
 * @return {Object} IFormMeta object exposing various aspects of an
 * Intelligent Form ...
 * ```
 *  {
 *    registrar: { // auto-generated items to be externally registered
 *      // iForm action creators to be injected into action-u generateActions()
 *      formActionGenesis(): ActionGenesis
 *      
 *      // iForm logic modules (providing intelligent validation) to be registered to redux-logic
 *      formLogic(formActions): logic[]
 *      
 *      // iForm reducer to be registered in the redux state management process
 *      formReducer(formActions): function
 *    }
 * 
 *    // the selector that promotes self's specific formState, given the top-level appState
 *    selectFormState(appState): formState
 *
 *    // create an IForm helper object, providing convenience accessors/handlers, avoiding direct formState interpretation
 *    IForm(formState, dispatch): Object
 *  }
 * ```
 */
// ?? MORE PARAMS: mapDomainToForm=defFun, mapFormToDomain=defFun,
export default function IFormMeta({formDesc,
                                   formSchema,
                                   selectFormState,
                                   ...unknownArgs}={}) {

  // ***
  // *** validate parameters
  // ***

  const check = verify.prefix('IFormMeta() parameter violation: ');

  check(formDesc,            'formDesc is required');
  check(isString(formDesc),  'invalid formDesc (expecting a string)');

  check(formSchema,          'formSchema is required');
  check(formSchema.validate, 'invalid formSchema (expecting a Yup Schema)'); // duck type check

  check(selectFormState,             'selectFormState is required');
  check(isFunction(selectFormState), 'invalid selectFormState (expecting a function)');

  const unknownArgKeys = Object.keys(unknownArgs);
  check(unknownArgKeys.length===0,  `unrecognized named parameter(s): ${unknownArgKeys}`);


  // ***
  // *** decompose meta info from the supplied Yup Schema (like fieldNames and labels)
  // ***

  // fieldNames: String[]
  const fieldNames = Object.keys(formSchema.fields);

  // labels: { ... fallback to fieldName when NO schema label supplied
  //   fieldName1: string,
  //   fieldName2: string
  // }
  const labels = fieldNames.reduce( (labels, fieldName) => {
    labels[fieldName] = formSchema.fields[fieldName].describe().label || fieldName;
    return labels;
  }, {FORM: formDesc}); // initial value contains our formDesc


  // ***
  // *** define the auto-generated iForm action creators to be injected into action-u generateActions()
  // ***

  /**
   * Promote the auto-generated action creators required by self's
   * iForm.
   *
   * @param {string} formRootActionType the root action type for self's iForm.
   * ??## consider this: 
   *      - only needed to qualify parameter validation
   *      - currently qualifing with self's formDesc (and we may be even bypass this validation)
   * 
   * @param {ActionGenesis} [additionalActions] any app-specific
   * additional action creators to suplement the auto-generated form
   * actions.
   * ??## consider this (if needed)
   * 
   * @return {ActionGenesis} the auto-generated action creators
   * required by self's iForm.  This is an action-u ActionGenesis
   * sub-structure that is to be injected into the action-u
   * generateActions() process.  The following action creators are
   * defined:
   * ```
   *    ${formActionGenesis}: {
   *      open() ... activate form processing
   *      fieldChanged(fieldName, value): ... maintain controlled field state change (with validation)
   *      ?more-here
   *      ?appSpecificActions() ... defined via supplied additionalActions param
   *    }
   * ```
   */
  function formActionGenesis() {

    // NOTE: As an optimization, we bypass detailed action creator validation
    //       because it is a controlled invocation (by IForm components).
    //       ... Even though fieldName is in the developer realm, the fieldName is validated by our IFormElm components
    //       ... Here is an example ratify() for the fieldChanged() action creator:
    //             ratify(fieldName, value) {
    //               verify(isString(fieldName), `'${formDesc}' form fieldChanged() action creator ... fieldName param is NOT a string: ${fieldName}`);
    //               verify(labels[fieldName],   `'${formDesc}' form fieldChanged() action creator ... fieldName: '${fieldName}' is NOT one of the expected fields: ${fieldNames}`);
    //               verify(isString(value),     `'${formDesc}' form fieldChanged() action creator ... value param is NOT a string: ${value}`);
    //               return [fieldName, value];
    //             },

    const myFormActions = {

      open: {         // open(??): Action ?? refine this to include initialization parameters/settings
                      // > activate form processing
                      actionMeta: {
                      },
      },

      fieldChanged: { // fieldChanged(fieldName, value): Action
                      // > maintain controlled field state change (with validation)
                      actionMeta: {
                        traits: ['fieldName', 'value'],
                      },
      },

      process: {      // process(): Action
                      // > process this form
                      actionMeta: {
                      },
      },

      close: {        // close(): Action
                      // > close this form
                      actionMeta: {
                      },
      },

    };

    return myFormActions;
  }


  // ***
  // *** define the auto-generated iForm logic modules (providing intelligent validation) to be registered to redux-logic
  // ***

  /**
   * Promote the redux-logic modules that orchestrates various iForm
   * characteristics, such as validation.
   *
   * @param {ActionNode} formActions the set of action creators (an
   * action-u structure) supporting self's iForm.
   * 
   * @return {logic[]} the redux-logic modules that perform low-level
   * iForm business logic (such as validation).  This should be
   * registered to the redux-logic process.
   */
  function formLogic(formActions) {

    // validate parameters
    const check = verify.prefix('IFormMeta.formLogic() parameter violation: ');
    check(formActions,          'formActions is required');
    check(isFunction(formActions.fieldChanged), 'invalid formActions (expecting an iForm action-u ActionNode)'); // duck type check

    // promote our iForm logic[]
    return [

      createLogic({
        name: `validateFields for '${formDesc}' form`,
        type: String(formActions.fieldChanged),

        validate({getState, action, api}, allow, reject) { // ?? we could consider this a transform() with next(action) since we never reject()

          // NOTE: action has: fieldName/value

          // locate our formState (from our appState)
          // ??$$
          const appState = getState(); // ??$$ KEY-QUESTION is this the top-level state, or intermediate state
          //                                   ?? it has to be top-level, which means we need to know how to get from their to our form
          //                                      ... prop a formLogic() function param: DESC: return the appropriate form state, given the top-level appState
          //                                            getFormState ... (appState) => appState.auth.signInForm
          //                                      ... usage:
          //                                            const formState = getFormState(appState);

          // ? console.log(`?? iForm logic: validateFields, appState: `, appState);

          // ??$$ perform validation
          // -and-
          // ?? supplement action with field-specific validation errors
          //    ?? append on existing errors from: appState.auth.signInForm
          // ? action.validationMsgs = {
          // ?   [action.fieldName]: `msg here!`
          // ? };

          // ?? supplement action with validation errors, once form validation has been triggered
          // ... typically by submit button
          // ? if (appState.auth.signInForm.validationEnabled) {
          // ? }
          
          // continue processing, supporting field updates, and visualizing any validation errors
          allow(action);

        },
      }),

    ];

    // ?? more logic
  }



  // ***
  // *** define the auto-generated iForm reducer to be registered in the redux state management process
  // ***

  /**
   * Promote the auto-generated reducer required by self's iForm, that
   * maintains our form's redux state.
   *
   * @param {ActionNode} formActions the set of action creators (an
   * action-u structure) supporting self's iForm.
   * 
   * @return {function} the reducer that maintains our iForm redux
   * state.  This reducer is to be registered in the redux state
   * management process.  The following state shape is maintained:
   * ```
   *    ${formState}: { // ex: appState.auth.signInForm
   *
   *      labels: {       // field labels (UI promotion and validation msg content)
   *        FORM:         string, // form desc
   *        <fieldName1>: string,
   *        <fieldName2>: string,
   *      },
   *
   *      values: {       // field values
   *        <fieldName1>: string,
   *        <fieldName2>: string,
   *      },
   *
   *      msgs: {          // validation msgs (if any) ... initial: {} ???
   *        FORM:          string, // msg spanning entire form ... null/non-exist for valid
   *        <fieldName1>:  string, // null/non-exist for valid
   *        <fieldName2>:  string, // null/non-exist for valid
   *      },
   *
   *      validating: {    // demarks which fields are being validated ... based on whether it has been touched by user (internal use only)
   *        FORM:          boolean, // ALL fields validated (takes precedence)
   *        <fieldName1>:  boolean,
   *        <fieldName2>:  boolean,
   *      },
   *    }
   * ```
   */
  function formReducer(formActions) {

    // validate parameters
    const check = verify.prefix('IFormMeta.formReducer() parameter violation: ');
    check(formActions,          'formActions is required');
    check(isFunction(formActions.fieldChanged), 'invalid formActions (expecting an iForm action-u ActionNode)'); // duck type check

    // generate our reducer function
    const myFormReducer = reducerHash({

      [formActions.open]: (state, action) => {
        // ??$$ must interpret optional initial action props
        return {
          labels,
          values: fieldNames.reduce( (values, fieldName) => {
            values[fieldName] = '';
            return values;
          }, {}),
          msgs: {},
          validating: {},
        };
      },

      [formActions.fieldChanged]: (state, action) => {

        // carve out new container (supporing immutable state)
        // ??$$ must interpret logic-injected action.msgs, and action.validating
        const newState = {...state};

        // merge new field value
        newState.values = {...state.values, ...{[action.fieldName]: action.value}};

        // that's all folks
        return newState;
      },

      [formActions.close]: (state, action) => null,

    }, null); // initialState

    // promote our iForm reducer function
    return myFormReducer;
  }



  // ***
  // *** define our IForm helper object
  // ***

  /**
   * Create an IForm helper object, providing convenience
   * accessors/handlers, avoiding direct formState intepretation.
   *
   * @param {ReduxState} formState the redux form state supporting
   * self's form.
   *
   * @param {ActionNode} formActions the set of action creators (an
   * action-u structure) supporting self's IForm.
   *
   * @param {function} dispatch the redux dispatch function, supporting
   * self's handlers.
   * 
   * @return {Object} the IForm helper object, with the following API:
   * ```
   * {
   *   // the label of the supplied field (or form when not supplied)
   *   getLabel(fieldName='FORM'): string
   *
   *   // the value of the supplied field (N/A for form)
   *   getValue(fieldName): string
   *
   *   // is supplied field value valid (or form when not supplied
   *   // ... i.e. all fields in form), irrespective to whether errors are
   *   // exposed to the user or not
   *   isValid(fieldName='FORM'): boolean
   * 
   *   // the validation msg of supplied field (or form when not supplied)
   *   // irrespective to whether errors are exposed to the user or not
   *   // - undefined/null for valid
   *   getMsg(fieldName='FORM'): string
   * 
   *   // the exposed validation msg of supplied field (or form when not
   *   // supplied) - undefined/null for valid.  The exposed msg is tailored 
   *   // to whether validation should be exposed to the user or not 
   *   // (BASED ON user touches).
   *   getExposedMsg(fieldName='FORM'): string
   *
   *   // Should validation messages be exposed for supplied field (or
   *   // form when not supplied), based on user touches.
   *   // 
   *   // This is needed to expose UI success/error icon adornment
   *   // (i.e. no adornment is shown if NOT yet being validated).
   *   //
   *   // NOTE: Form validation (when enabled) takes precedence over
   *   //       individual fields.
   *   isValidationExposed(fieldName='FORM'): boolean
   *
   *   // Service an IForm field value change.
   *   handleFieldChanged(fieldName, value): void
   *
   *   // Service an IForm process request.
   *   handleProcess(): void
   *
   *   // Service an IForm close request.
   *   handleClose(): void
   * }
   * ```
   */
  function IForm(formState, formActions, dispatch) {

    // ?? consider caching last instance only ... an optimization when injected by connect()

    // validate parameters
    const check = verify.prefix('IFormMeta.IForm() parameter violation: ');
    check(formState,            'formState is required'); // ?? can we somehow determine if the invoker supplied a missmatched formState?
    check(formActions,          'formActions is required');
    check(isFunction(formActions.fieldChanged), 'invalid formActions (expecting an iForm action-u ActionNode)'); // duck type check
    check(dispatch,             'dispatch is required');
    check(isFunction(dispatch), 'invalid dispatch (expecting a function)');

    /**
     * @return {string} the label of the supplied field (or form when
     * not supplied).
     */
    function getLabel(fieldName='FORM') {
      return formState.labels[fieldName];
    }

    /**
     * @return {string} the value of the supplied field (N/A for form).
     */
    function getValue(fieldName) {
      verify(fieldName || fieldName !== 'FORM', 'IFormMeta.IForm.getValue() unsupported fieldName: ${fieldName}');
      return formState.values[fieldName];
    }

    /**
     * Is supplied field value valid (or form when not supplied
     * ... i.e. all fields in form), irrespective to whether errors are
     * exposed to the user or not.
     * @return {boolean} 
     */
    function isValid(fieldName='FORM') {
      return fieldName==='FORM'
               ? Object.keys(formState.msgs).reduce( (valid, key) => valid && (formState.msgs[key] ? false : true), true)
               : formState.msgs[fieldName] ? false : true;
      // ?? option 2 (above is a bit cryptic)
      // ? if (fieldName==='FORM') {
      // ?   for (const key in formState.msgs) {
      // ?     if (formState.msgs[key]) {
      // ?       return false;
      // ?     }
      // ?   }
      // ?   return true;
      // ? }
      // ? return formState.msgs[fieldName] ? false : true;
    }

    /**
     * @return {string} the validation msg of supplied field (or form
     * when not supplied) irrespective to whether errors are exposed
     * to the user or not - undefined/null for valid
     */
    function getMsg(fieldName='FORM') {
      return formState.msgs[fieldName];
    }

    /**
     * @return {string} exposed validation msg of supplied field (or
     * form when not supplied) - undefined/null for valid.  The
     * exposed msg is tailored to whether validation should be exposed
     * to the user or not (BASED ON user touches).
     */
    function getExposedMsg(fieldName='FORM') {
      return isValidationExposed(fieldName) ? formState.msgs[fieldName] : null;
    }

    /**
     * Should validation messages be exposed for supplied field (or
     * form when not supplied), based on user touches.
     * 
     * This is needed to expose UI success/error icon adornment
     * (i.e. no adornment is shown if NOT yet being validated).
     *
     * NOTE: Form validation (when enabled) takes precedence over
     *       individual fields.
     *
     * @return {boolean} 
     */
    function isValidationExposed(fieldName='FORM') {
      return formState.validating.FORM || formState.validating[fieldName];
    }

    /**
     * Service an IForm field value change.
     */
    function handleFieldChanged(fieldName, value) {
      // console.log(`?? fieldChanged action emitted FROM IForm ... YEAH!`);
      dispatch( formActions.fieldChanged(fieldName, value) );
    }

    /**
     * Service an IForm process request.
     */
    function handleProcess() {
      dispatch( formActions.process() );
    }

    /**
     * Service an IForm close request.
     */
    function handleClose() {
      dispatch( formActions.close() );
    }

    // promote our IForm helper object
    return {
      getLabel,
      getValue,
      isValid,
      getMsg,
      getExposedMsg,
      isValidationExposed,
      handleFieldChanged,
      handleProcess,
      handleClose,
    };
  }



  // ***
  // *** publicly expose needed IFormMeta characteristics
  // ***

  return {
    registrar: {
      formActionGenesis,
      formLogic,
      formReducer,
    },
    selectFormState,
    IForm,
  };

}
