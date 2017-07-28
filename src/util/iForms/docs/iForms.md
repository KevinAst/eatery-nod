# iForms *(Intelligent Forms)*


iForms is a logic-based forms utility.  It provides the basis for
automating your form processing through [redux-logic] hooks.  This
simplifies your display components (removing the clutter), while
encapsolating business-related concerns (like validation, and forms
submition) squarely where it belongs - **in your business logic**.

If your using [redux-logic], then iForms is your go-to choice for forms!


## At a Glance

- [Intro](#intro)
- [Sample](#sample)
- [A Closer Look](#a-closer-look)
  * [Form Actions](#form-actions)
  * [Form State](#form-state)
  * [Form Logic](#form-logic)
  * [Form Components](#form-components)
  * [Form Input/Output Boundaries (via App Domains)](##form-input-output-boundaries-via-app-domains-)
  * [??more](#bla-)
- [API](#api)
  * [IFormMeta](#iformmeta)
    - registrar
      * [formActionGenesis](#iformmeta-registrar-formactiongenesis)
      * [formLogic](#iformmeta-registrar-formlogic)
  * [??more](#bla-)

?? TODO: some of the links (above are different in GitHub)

## Intro

Let's be honest - implementing React forms by hand is extremely verbose.
There are so many details to attend to:

 - **Field Validation**: *a tricky process in a polished UI that dynamically presents
   messages only at appropriate times*
   * how to model the validation constraints?
   * when to validate and when to expose messages? *... based on
     dynamics of field touches, and form submition*
   * how to enforce validation constraints?

 - **Form Inputs/Outputs**
   * how are app-specific inputs/outputs translated into/out-of the
     forms processor?

 - **Form Processing**
   * how are app-specific logic hooks injected, when the form is
     submitted for processing?

There are a lot of forms processors out there, many of which attempt
way too much magic, some at a significant performance cost.  But none
of them model forms processing where it belongs: **in your logic!**

iForm is a light-weight reusable forms solution whose focus is on a
concise declarative form definition:

  - **Form Schemas** are defined through [Yup] (a lightweight [Joi]
    inspired utility), concisely defining:

    * the fields that make up a form
    * field data types
    * validation constraints (in a declarative way)
    * field labels *(by modeling in schema, provides access to both the form UI and validation messages)*

  - **Translation hooks** are available to map app-specific domains
    to/from the forms processor, *making it convenient for your logic
    to utilize app-specific structures*.

  - **Forms-related aspects** needed for all forms are **auto-generated**,
    including:
    * actions (a pre-defined set of actions required for all forms)
    * logic (implementing the hard work of validation, and dynamic presentation)
    * reducers (facilating form state management)

  - A series of **input form elements** (e.g. ITextField) is provided,
    which auto-wires to the iForm actions/state, and automatically
    formats validation msgs, etc.

**Bottom line**: iForms promotes **painless re-usability!**  As a bonus**,
**it is logic-based, so it is **extremely simple to inject
**app-specific logic** to manipulate various business-related items.


## Sample

In this sample we gather information for a sign-in form *(email and
password)*.

The following screens represents our form's progression with
incremental user interaction *(click each screen to expand)*:

| initial | partial email | premature `Sign In` | email correction | password correction | `Sign In` accepted
| ------- | ------- | ------- | ------- | ------- | -------
| [![](screenShots/screen1.png)](screenShots/screen1.png) | [![](screenShots/screen2.png)](screenShots/screen2.png) | [![](screenShots/screen3.png)](screenShots/screen3.png) | [![](screenShots/screen4.png)](screenShots/screen4.png) | [![](screenShots/screen5.png)](screenShots/screen5.png) | [![](screenShots/screen6.png)](screenShots/screen6.png) 

- **Notice the dynamics** of the validation messages.

- **Also notice** if we process the form pre-maturely, the process
  request is rejected, and all field validations are exposed.



This can be **accomplished with minimal effort**.  We simply do the
following:

1. First we define an IFormMeta instance that represents this sign-in
   form *(a simple and declarative process)*:

   **src/logic/iForms/signInFormMeta.js**
   ```js
   import Yup        from 'yup';
   import IFormMeta  from '../../util/iForms/IFormMeta';
   import actions    from '../../actions';

   export default IFormMeta({
     formDesc:  'Sign In',
     formSchema: Yup.object().shape({
       email:    Yup.string().required().email()        .label('Email'),
       pass:     Yup.string().required().min(6).max(9)  .label('Password'),
     }),
     formActionsAccessor: ()         => actions.auth.signIn,
     formStateSelector:   (appState) => appState.auth.signInForm,
   });
   ```

   - *This is a simple and declarative process*, that packs a lot of
     information!

   - The `formDesc` defines a label for our form *(for human
     consumption)*.

   - The `formSchema` defines all of our form fields (email, pass),
     including:
     * names
     * types
     * labels *(for human consumption)*
     * validation constraints

   - The `formActionsAccessor` identifies where the sign-in form
     actions can be found (the root of our action-u tree).

   - The `formStateSelector` identifies where the sign-in form
     state can be found (the root of our state tree).

2. Next we register the auto-generated forms-related items.  This is
   accomplished in 3 different places, and is basically 3 lines of
   code *(please refer to [A Closer Look](#a-closer-look) for
   registration details)*:

   ```js
   import signInFormMeta from '../logic/iForms/signInFormMeta';

   // iForm action creators to be injected into action-u generateActions()
   ... signInFormMeta.registrar.formActionGenesis(): ActionGenesis
   
   // iForm logic modules (providing intelligent validation) to be registered to redux-logic
   ... signInFormMeta.registrar.formLogic(): logic[]
   
   // iForm reducer to be registered in the redux state management process
   ... signInFormMeta.registrar.formReducer(): function
   ```

3. Lastly we define our screen component that promotes our form (and
   it's fields):

   **src/comp/SignInScreen.js**
   ```js
   import React        from 'react';
   import {connect}    from 'react-redux';
   import PropTypes    from 'prop-types';
   import {Body,
           ... omitted for brevity
           View}         from 'native-base';
   import signInFormMeta from '../logic/iForms/signInFormMeta';
   import ITextField     from '../util/iForms/comp/ITextField';

   function SignInScreen({iForm}) {
   
     const formLabel     = iForm.getLabel();
     const formInProcess = iForm.inProcess();
   
     return (
       <Container>
         <Header>
           <Body>
             <Title>{formLabel}</Title>
           </Body>
         </Header>
   
         <Content>
          <Form>
   
            <View>
              <Text>Welcome to eatery-nod, please {formLabel}!</Text>
            </View>
   
            <ITextField fieldName="email"
                        iForm={iForm}
                        placeholder="jon.snow@gmail.com"
                        keyboardType="email-address"/>
   
            <ITextField fieldName="pass"
                        iForm={iForm}
                        secureTextEntry/>
   
            <Text style={{color:'red'}}>{iForm.getMsg()}</Text> {/* form msg  */}
   
            <Button success
                    full
                    onPress={iForm.handleProcess}
                    disabled={formInProcess}>
              <Text>{formLabel}</Text>
            </Button>
   
           {formInProcess && <Spinner color="blue"/>} {/* inProcess spinner  */}
   
          </Form>
         </Content>
       </Container>
     );
   }
   
   SignInScreen.propTypes = {
     iForm: PropTypes.object.isRequired,
   };
   
   export default connect(
     // mapStateToProps()
     (appState) => ({ formState: signInFormMeta.formStateSelector(appState) }),
   
     null, // mapDispatchToProps()
   
     // mergeProps()
     (stateProps, dispatchProps) => ({ iForm: signInFormMeta.IForm(stateProps.formState, 
                                                                   dispatchProps.dispatch) })
   )(SignInScreen);
   ```
   
   - **Notice** that we utilize the `ITextField` iForm component to promte the
     text fields.  This component auto-wires to the iForm actions/state,
     and automatically promotes validation msgs at the appropriate time.
     
   - **Also notice** that we use the **iForm helper object** (promoted
     from signInFormMeta) that insulates us from the details of the
     iForm state and handlers.  From this we can:
      * access:
        - field labels (and form labels)
        - field values
        - field validation messages (and form messages)
      * handle a variety of events


## A Closer Look

All forms are modeled consistantly, through a set of reusable items
(actions, logic, and reducers) that is auto-generated by iForms.

The following topics further reveal how iForm works, and provides
insight into typical app-specific hooks.

?? is a picture in order?

?? this may be more of an internal implementation detail
   - of public interest
     * xx IFormMeta creation (?? briefly discussed in Sample, and detailed furhter in API)
     * xx registration ?? discuss each in appriate section (below)
     * boundary input/output ?? key item (below)
     * app-specific processing ?? discuss in appropriate sections (below)

### Form Actions

The following standard actions are consistently maintained for each
iForm:

```
${formActionGenesis}: {

  open([domain] [,formMsg])      ... activate the form state, initiating form processing

  fieldChanged(fieldName, value) ... maintain controlled field state change (with validation)
                                     NOTE: IForm logic supplements action with validation msgs

  fieldTouched(fieldName)        ... maintain field touched status, impacting validation dynamic exposure
                                     NOTE: IForm logic supplements action with validation msgs

  process()                      ... process this form
                                     NOTE 1: IForm logic will reject this action, when the form is invalid
                                     NOTE 2: IForm logic supplements action with values (of appropriate
                                             data types) and domain (in app-specific structure)

    reject(msgs)                 ... reject process action with supplied validation msgs

  close()                        ... close this form

  ...appSpecificActions()        ... app-specific action creators supplementing the auto-generated formActions
}
```

**Registration**

Even though these actions are auto-generated, they must be registered
in your action-u structure.  This is accomplished through the
iFormMeta.registrar.formActionGenesis() method.  Here is an example:

**src/actions/auth.js**
```js
import {generateActions} from 'action-u';
import signInFormMeta    from '../logic/iForms/signInFormMeta';

export default generateActions.root({
  auth: {
    ... snip snip (other actions omitted)

    // inject the standard iForm auto-generated form actions
    // ... open(), fieldChanged(), fieldTouched(), process(), process.reject(), close()
    signIn: signInFormMeta.registrar.formActionGenesis({

      // along with additional app-specific actions:

                  // auth.signIn(email, pass): Action
                  // > SignIn with supplied email/pass
                  actionMeta: {
                    traits: ['email', 'pass'],
                  },

      complete: { // auth.signIn.complete(auth): Action
                  // > signIn completed successfully
                  actionMeta: {
                    // traits: ['auth],
                  },
      },

      fail: {     // auth.signIn.fail(err): Action
                  // > signIn failure
                  actionMeta: {
                    traits: ['err'],
                  },
      },


    }),
  },
});

```

**App-Specific Additions**

You can supply additional app-specific actions through the optional
`appInjectedFormActions` iFormMeta.registrar.formActionGenesis()
parameter (as seen above).

This is typically used to introduce fail/complete actions that are
spawned out of app-specific logic modules.  

NOTE: the formAction root can even become an action creator by
promoting a top-level actionMeta node in this structure.


### Form State
    ??
    ?? discuss registration
    ?? typically no app-specific additions are needed

    ?? discuss insulated from state through IForm helper


### Form Logic

iForms maintain a consistent set of redux-logic modules that
orchestrates various iForm characteristics, such as validation.  The
following actions are monitored by these logic modules:

| formActions monitored         | perform
| ----------------------------- | -------
| fieldChanged<br/>fieldTouched | validate specific field, injecting msgs in action
| process                       | validate ALL fields, injecting msgs in action <br/> - reject `process` action on validation problems (via `process.reject` action) <br/> - allow `process` action on clean validation, supplementing action with values/domain


**Registration**

Even though iForm logic modules are auto-generated, they must be registered
in your app's redux-logic catalog.  This is accomplished through the
iFormMeta.registrar.formLogic() method.  Here is an example:

**src/logic/auth.js**
```js
import signInFormMeta from './iForms/signInFormMeta';

// promote all logic (accumulated in index.js)
export default [
  ... snip snip (other logic modules omitted)

  // signIn logic (NOTE: form logic just be registered BEFORE app-specific logic)
  ...signInFormMeta.registrar.formLogic(), // inject the standard SignIn form-based logic modules
  processSignIn,                           // app-specific sign-in logic
];
```

**App-Specific Additions**

App-specific form processing logic additions can be injected through
the normal redux-logic registration process (as seen above - see
`processSignIn`).  

This is typically used to inject form submission process logic, once
the form has been cleanly validated by iForms.

NOTE: The only caveot is your app-logic should be regestered after the
iForm logic (so as to auto reject invalid form state).


### Form Components

    iForms provides a set of intelligent-form-based input form
    elements (ex: ITextField).  These components auto-wire to the
    actions/state of an iForm, and automatically expose validation
    msgs at the appropriate time (considering user touches and form
    submission, etc.).

    - ?? itemize what they do
      x) present the form elements in a polished way, visualizing
         validation messages as needed
      x) emits the low-level actions (via auto-wired events) needed to
         interact with the iFormMeta logic process.

    Currently, these components are somewhat limited in scope, because
    they are specific to react-native, and use the native-base
    component library.  With that said, you can use them as a pattern
    to build your own, using your preferred component library.


### Form Input/Output Boundaries (via App Domains)

When a form is initiated, the `open` action is optionally supplied a
domain object, to initialize the form (when not supplied all form
fields start out as empty strings).

We use the term "domain" in a generic way, that can manifest itself in
a variety of different things.  It can be a real application domain
object (say from an API call), or another part of your state tree, or
any number of other things.

Likewise, when the form is processed (via the `process` action), the
form values will be mapped back to the domain representation (retained
in the `process` action).

This makes it convenient for your logic to operate using app-specific
structures.

You can easily define the mapping between your domain and the form
values structure, through the optional ??mapDomain2Form/??mapPropsToValues
parameters.  By default (when not supplied), the domain structure is
assumed to be "one in the same" as the form values structure (through
a straight mapping of the well known iForm fields).


## API

### IFormMeta

The primary iForm function that creates an IFormMeta object
encapsolating the characteristics of an Intelligent Form (a reusable
forms utility that is logic-based (using redux-logic).

**API:**
```
  IFormMeta({formDesc,
             formSchema,
             formActionsAccessor,
             formStateSelector,
             [mapDomain2Form],
             [mapForm2Domain]}): IFormMeta
```

- **formDesc**: string - a human-interpretable description for this form (ex:
  'Sign In').
  
- **formSchema**: ObjectSchema - the Yup Schema object defining form
  fields, labels, and validation characteristics.
  
- **formActionsAccessor**: function - an accessor function that
  promotes our specific formActions.  A function is used to avoid
  cyclic dependencies in the startup bootstrap process (because BOTH
  actions and IFormMeta instances are created in-line).

  `API: () => formActions`
  
- **formStateSelector**: function - a selector function that promotes
  our specific formState, given the top-level appState.

  `API: (appState) => formState`
  
- **[mapDomain2Form]**: function - optionally define a mapping between
  an app domain object and the form values (employed through the
  `open` action).  When not specified, a straight mapping of any iForm
  fields is used.

  `API: (domain) => values`
  
  Ex:
  ```
    mapDomain2Form: (domain) => ({
      id:        domain.id,
      email:     domain.email,
      firstName: domain.name.first,
      lastName:  domain.name.last
    })
  ```
  
- **[mapForm2Domain]**: function - optionally define a mapping between
  form values and the app domain object (employed through the
  `process` action).  When not specified, a straight mapping of the
  iForm values is used (i.e. domain is same as values).

  `API: (castValues) => domain // NOTE: castValues have been "cast" to the appropriate type`
  
  Ex:
  ```
    mapForm2Domain: (castValues) => ({
      id:       castValues.id,
      email:    castValues.email,
      name:  {
        first:  castValues.firstName,
        last:   castValues.lastName
      }
    })
  ```

**Return**: **IFormMeta** - exposing various aspects of an Intelligent Form ...
```
{
  registrar: { // auto-generated items to be externally registered
    // iForm action creators to be injected into action-u generateActions()
    formActionGenesis([appInjectedFormActions]): ActionGenesis
    
    // iForm logic modules (providing intelligent validation) to be registered to redux-logic
    formLogic(): logic[]
    
    // iForm reducer to be registered in the redux state management process
    formReducer(): function
  }

  // the selector that promotes self's specific formState, given the top-level appState
  formStateSelector(appState): formState

  // create an IForm helper object, providing convenience accessors/handlers, 
  // avoiding direct formState interpretation
  IForm(formState, dispatch): Object
}
```




### iFormMeta.registrar.formActionGenesis

Promote the auto-generated action creators required by self's
iForm.

**API:**
```
formActionGenesis([appInjectedFormActions]): ActionGenesis
```

- **[appInjectedFormActions]**: ActionGenesis - optionally specify
app-specific action creators to suplement the auto-generated
formActions.  This is typically used to introduce fail/complete
actions that are spawned out of app-specific logic modules.  NOTE: the
formAction root can even become an action creator by promoting a
top-level actionMeta node in this structure.

**Return**: **ActionGenesis** - the auto-generated action creators
required by self's iForm.  This is an action-u ActionGenesis
sub-structure that is to be injected into the action-u
generateActions() process.  The [Form Actions](#form-actions) section
details what these actions look like.

?? DONE: reduce dups - reference this structure in closer look


### iFormMeta.registrar.formLogic

Promote the redux-logic modules that orchestrates various iForm
characteristics, such as validation.

**API:**
```
formLogic(): logic[]
```

**Return**: **logic[]** - the redux-logic modules that perform
low-level iForm business logic (such as validation).  This should be
registered to the app's redux-logic process.  The [Form
Logic](#form-logic) section discusses this in more detail.

?? DONE: reduce dups - reference this structure in closer look


???%%% REFERENCE
???%%% NEW
???%%% RETROFIT THIS ????????????????????????????????????????????????????????????????






















### ?? keep going if you like this format?


?? spell check everywhere

[redux-logic]: https://github.com/jeffbski/redux-logic
[Yup]:         https://github.com/jquense/yup
[Joi]:         https://github.com/hapijs/joi