import Yup        from 'yup';
import IFormMeta  from '../../util/iForms/IFormMeta';
import actions    from '../../actions';

const distanceMsg = 'Miles should be a number between 1 and 30';

export default IFormMeta({
  formDesc:  'Discovery Filter',
  formSchema: Yup.object().shape({
    searchText: Yup.string().label('Search'),
    distance:   Yup.number().label('Miles').typeError(distanceMsg).required().min(1, distanceMsg).max(30, distanceMsg),
    minprice:   Yup.string().label('Price')
  }),
  formActionsAccessor: ()         => actions.discovery.filter,
  formStateSelector:   (appState) => appState.discovery.filterForm,
});
