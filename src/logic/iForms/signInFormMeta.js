import Yup        from 'yup';
import IFormMeta  from '../../util/iForms/IFormMeta';
import actions    from '../../actions';

export default IFormMeta({
  formDesc:  'Sign In',
  formSchema: Yup.object().shape({
    email:    Yup.string().required().email()        .label('Email'),
    pass:     Yup.string().required().min(6).max(9)  .label('Password'), // TODO: add password regex check: https://dzone.com/articles/use-regex-test-password
    someNum:  Yup.number().required().integer().min(6).max(9)  .label('Some Number'), // ?? temp to test number
  }),
  formActionsSelector: ()         => actions.auth.signIn,
  formStateSelector:   (appState) => appState.auth.signInForm,

  // ?? temp test 
  mapDomain2Form: (domain) => ({
    email:     domain.struct1.email,
    pass:      domain.struct2.pass,
    someNum:   domain.struct3.someNum+'',
    // poopParm:  'poopy',
  }),

  // ?? temp test 
  mapForm2Domain: (castValues) => ({
    struct1: {
      email: castValues.email,
    },
    struct2: {
      pass: castValues.pass,
    },
    struct3: {
      someNum: castValues.someNum,
    },
  }),

});
