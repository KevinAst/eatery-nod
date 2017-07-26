import Yup        from 'yup';
import IFormMeta  from '../../util/iForms/IFormMeta';
import actions    from '../../actions';

export default IFormMeta({
  formDesc:  'Sign In',
  formSchema: Yup.object().shape({
    email:    Yup.string().required().email()        .label('Email'),
    pass:     Yup.string().required().min(6).max(9)  .label('Password'), // TODO: add password regex check: https://dzone.com/articles/use-regex-test-password
  }),
  formActionsAccessor: ()         => actions.auth.signIn,
  formStateSelector:   (appState) => appState.auth.signInForm,
});
