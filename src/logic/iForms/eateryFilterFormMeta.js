import Yup        from 'yup';
import IFormMeta  from '../../util/iForms/IFormMeta';
import actions    from '../../actions';

const distanceMsg = 'Miles should be a positive number (when supplied)';

export default IFormMeta({
  formDesc:  'Pool Filter',
  formSchema: Yup.object().shape({
    // distance is an optional positive number (or null for any distance)
    // NOTE: could NOT get default() to work, but transform() to null, works in conjunction with .nullable()
    distance:   Yup.number().label('Miles').typeError(distanceMsg).nullable().transform(val => val || null).positive(distanceMsg),
  }),
  formActionsAccessor: ()         => actions.eateries.applyFilter,
  formStateSelector:   (appState) => appState.eateries.listView.filterForm,
});